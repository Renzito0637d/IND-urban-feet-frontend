import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Zapatilla, ZapatillaVariacion } from '../../models/zapatilla.model';
import { toast } from 'ngx-sonner';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';

interface ColorGroup {
  colorName: string;
  imageUrl: string;
  variaciones: ZapatillaVariacion[]; // Todas las tallas de este color
}

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ProductoDetalleComponent>);
  public data: Zapatilla = inject(MAT_DIALOG_DATA); // Recibimos la zapatilla
  private carritoService = inject(CarritoService);
  addingToCart = false;
  private authService = inject(AuthService); // 4. Inyectar AuthService
  private dialog = inject(MatDialog);

  // Estado de la UI
  coloresUnicos: ColorGroup[] = [];
  colorSeleccionado: ColorGroup | null = null;
  tallaSeleccionada: ZapatillaVariacion | null = null;

  imagenActual: string = '';
  precioActual: number = 0;

  ngOnInit(): void {
    if (this.data && this.data.variaciones) {
      this.procesarVariaciones(this.data.variaciones);
    }
  }

  // Agrupa la lista plana de variaciones por Color
  procesarVariaciones(variaciones: ZapatillaVariacion[]) {
    const mapa = new Map<string, ColorGroup>();

    variaciones.forEach(v => {
      if (!mapa.has(v.color)) {
        mapa.set(v.color, {
          colorName: v.color,
          imageUrl: v.imageUrl || '/assets/images/placeholder.png',
          variaciones: []
        });
      }
      mapa.get(v.color)?.variaciones.push(v);
    });

    this.coloresUnicos = Array.from(mapa.values());

    // Seleccionar el primer color por defecto
    if (this.coloresUnicos.length > 0) {
      this.selectColor(this.coloresUnicos[0]);
    }
  }

  selectColor(grupo: ColorGroup) {
    this.colorSeleccionado = grupo;
    this.imagenActual = grupo.imageUrl;
    // Resetear talla al cambiar color
    this.tallaSeleccionada = null;
    // Precio base (puede cambiar según talla si tu negocio lo dicta, aquí tomo el primero)
    this.precioActual = grupo.variaciones[0].precio;
  }

  selectTalla(variacion: ZapatillaVariacion) {
    if (variacion.stock > 0) {
      this.tallaSeleccionada = variacion;
      this.precioActual = variacion.precio; // Actualizar precio por si varía por talla
    }
  }

  addToCart() {
    if (!this.tallaSeleccionada || !this.tallaSeleccionada.id) {
      toast.warning('Por favor, selecciona una talla.');
      return;
    }

    if (!this.authService.isAuthenticated()) {
      toast.info('Inicia sesión para agregar productos al carrito');

      this.dialog.open(LoginComponent, {
        width: '400px',
      });
      return;
    }

    this.addingToCart = true;

    const request = {
      zapatillaVariacionId: this.tallaSeleccionada.id,
      cantidad: 1
    };

    this.carritoService.addItem(request).subscribe({
      next: () => {
        toast.success('Producto agregado al carrito');
        this.addingToCart = false;
        this.dialogRef.close();
      },
      error: (err) => {
        console.error(err);
        if (err.status === 400) {
          toast.error(err.error || 'No se pudo agregar');
        } else {
          toast.error('Ocurrió un error al agregar al carrito');
        }
        this.addingToCart = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  getColorStyle(colorName: string): any {
    if (!colorName) return {};

    // Normalizamos para comparar (ignorar mayúsculas)
    const color = colorName.toLowerCase();

    switch (color) {
      case 'negro':
        return { backgroundColor: '#171717' }; // neutral-900
      case 'blanco':
        return { backgroundColor: '#ffffff' };
      case 'rojo':
        return { backgroundColor: '#ef4444' }; // red-500
      case 'azul':
        return { backgroundColor: '#3b82f6' }; // blue-500
      case 'verde':
        return { backgroundColor: '#22c55e' }; // green-500
      case 'amarillo':
        return { backgroundColor: '#eab308' }; // yellow-500
      case 'otros':
        // Círculo multicolor (Arcoiris)
        return {
          background: 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)'
        };
      default:
        // Si no coincide, intentamos usar el valor tal cual (por si guardaste un Hex)
        return { backgroundColor: colorName };
    }
  }
}