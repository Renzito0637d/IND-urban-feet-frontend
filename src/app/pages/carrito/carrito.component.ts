import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { toast } from 'ngx-sonner';
import { Carrito, CarritoItemDetail } from '../../models/carrito.model';
import { MatDialog } from '@angular/material/dialog';
import { ProcederPagoComponent } from '../../components/proceder-pago/proceder-pago.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  private carritoService = inject(CarritoService);
  private dialog = inject(MatDialog);

  carrito: Carrito | null = null;

  // Loading inicial (carga de página completa)
  loading = true;

  // Loading específico para acciones (evita que el usuario pulse mil veces + + +)
  updatingItemId: number | null = null;

  ngOnInit(): void {
    // La primera vez SÍ queremos mostrar el skeleton (true)
    this.cargarCarrito(true);
  }

  /**
   * @param showSkeleton Define si mostramos la animación de carga completa.
   * Para actualizaciones (sumar/restar), pasaremos 'false'.
   */
  cargarCarrito(showSkeleton: boolean = true) {
    if (showSkeleton) {
      this.loading = true;
    }

    this.carritoService.getCarrito().subscribe({
      next: (data) => {
        this.carrito = data;
        this.loading = false;
        // Reseteamos el loading individual
        this.updatingItemId = null;
      },
      error: (err) => {
        console.error('Error al cargar carrito:', err);
        this.loading = false;
        this.updatingItemId = null;
      }
    });
  }

  updateQty(item: CarritoItemDetail, operacion: 'increment' | 'decrement') {
    // Evitar doble clic mientras procesa
    if (this.updatingItemId === item.id) return;

    if (operacion === 'decrement' && item.cantidad === 1) {
      this.deleteItem(item);
      return;
    }

    if (operacion === 'increment' && item.cantidad >= item.stockDisponible) {
      toast.warning(`Solo quedan ${item.stockDisponible} unidades.`);
      return;
    }

    // 1. Marcamos qué item se está actualizando (para bloquear sus botones)
    this.updatingItemId = item.id;

    // 2. OPTIMISMO UI (Opcional): Actualizamos visualmente YA para que se sienta instantáneo
    // (Si el backend falla, se corregirá solo al recargar o puedes revertirlo en el error)
    /* const originalQty = item.cantidad;
       item.cantidad += (operacion === 'increment' ? 1 : -1);
    */

    this.carritoService.updateCantidad(item.id, operacion).subscribe({
      next: () => {
        // 3. SILENT RELOAD: Recargamos PERO pasamos 'false' para no parpadear
        this.cargarCarrito(false);
      },
      error: (err) => {
        console.error(err);
        toast.error('No se pudo actualizar');
        this.updatingItemId = null; // Liberamos el bloqueo
        // item.cantidad = originalQty; // Si usaste optimismo, revierte aquí
      }
    });
  }

  deleteItem(item: CarritoItemDetail) {
    if (confirm(`¿Eliminar ${item.nombreProducto}?`)) {

      this.updatingItemId = item.id; // Bloqueamos visualmente

      this.carritoService.deleteItem(item.id).subscribe({
        next: () => {
          toast.success('Producto eliminado');
          // Silent reload
          this.cargarCarrito(false);
        },
        error: (err) => {
          console.error(err);
          toast.error('Error al eliminar');
          this.updatingItemId = null;
        }
      });
    }
  }

  // --- GETTERS ---
  get subtotal(): number {
    if (!this.carrito || !this.carrito.items) return 0;
    return this.carrito.items.reduce((acc, item) => {
      return acc + (item.cantidad * item.precioUnitario);
    }, 0);
  }

  get envio(): number {
    if (this.subtotal === 0) return 0;
    return this.subtotal > 300 ? 0 : 20;
  }

  get total(): number {
    return this.subtotal + this.envio;
  }

  getColorStyle(colorName: string): any {
    if (!colorName) return {};

    // Normalizamos para comparar (ignorar mayúsculas)
    const color = colorName.toLowerCase();

    switch (color) {
      case 'negro': return { backgroundColor: '#171717' }; // neutral-900
      case 'blanco': return { backgroundColor: '#ffffff' };
      case 'rojo': return { backgroundColor: '#ef4444' }; // red-500
      case 'azul': return { backgroundColor: '#3b82f6' }; // blue-500
      case 'verde': return { backgroundColor: '#22c55e' }; // green-500
      case 'amarillo': return { backgroundColor: '#eab308' }; // yellow-500
      case 'otros':
        // Círculo multicolor (Arcoiris)
        return {
          background: 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)'
        };
      default:
        // Si no coincide, intentamos usar el valor tal cual
        return { backgroundColor: colorName };
    }
  }

  openCheckout() {
    if (!this.carrito || this.carrito.items.length === 0) return;

    const ref = this.dialog.open(ProcederPagoComponent, {
      width: '500px',
      // Pasamos los items del carrito al modal
      data: this.carrito.items
    });

    ref.afterClosed().subscribe(result => {
      if (result === true) {
        // Si el pago fue exitoso, recargamos el carrito (que debería estar vacío)
        this.cargarCarrito();
      }
    });
  }
}