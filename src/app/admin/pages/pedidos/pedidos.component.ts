import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { PedidoService } from '../../../services/pedido.service';
import { PedidoResponse } from '../../../models/pedido.model';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './pedidos.component.html'
})
export class PedidosComponent implements OnInit {

  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  pedidos: PedidoResponse[] = [];

  // Control de edición: Guardamos el ID del pedido que se está editando
  editingId: number | null = null;

  // Copia temporal del pedido para editar (para no mutar el original hasta guardar)
  editBuffer: any = null;

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidoService.getAllAdmin().subscribe({
      next: (data) => {

        console.log(data);
        // Ordenamos por ID descendente (más nuevos primero)
        this.pedidos = data.sort((a, b) => b.id - a.id);

        // 3. FORZAR LA ACTUALIZACIÓN DE LA VISTA
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al cargar pedidos');
      }
    });
  }

  // --- Lógica de Edición ---

  activarEdicion(pedido: PedidoResponse) {
    this.editingId = pedido.id;
    // Clonamos profundamente el objeto para editar sin afectar la vista
    this.editBuffer = JSON.parse(JSON.stringify(pedido));
  }

  cancelarEdicion() {
    this.editingId = null;
    this.editBuffer = null;
  }

  guardarEdicion() {
    if (!this.editBuffer) return;

    // --- CASO 1: REPARTIDOR (Solo Estado) ---
    if (this.isRepartidor && !this.isAdmin) {

      this.pedidoService.updateStatus(this.editBuffer.id, this.editBuffer.estado).subscribe({
        next: () => {
          const index = this.pedidos.findIndex(p => p.id === this.editBuffer.id);

          if (index !== -1) {
            // 1. Actualizamos el estado visualmente
            this.pedidos[index].estado = this.editBuffer.estado;

            // 2. TRUCO: Agregamos una entrada "ficticia" al historial localmente
            // Esto hace que el timeline se actualice al instante sin recargar la página
            if (!this.pedidos[index].historial) {
              this.pedidos[index].historial = [];
            }

            this.pedidos[index].historial!.unshift({
              estado: this.editBuffer.estado,
              fecha: new Date().toISOString(), // Fecha actual
              usuario: 'Tú (Ahora)' // Opcional: mostrar algo genérico
            });
          }

          this.cerrarEdicion();
          toast.success('Estado actualizado correctamente');
        },
        error: (err) => {
          console.error(err);
          toast.error('No se pudo actualizar el estado');
        }
      });
      return;
    }

    // --- CASO 2: ADMIN (Edición Completa) ---
    const dto = {
      direccionId: this.editBuffer.direccionEnvio?.id || 1,
      metodoPago: this.editBuffer.metodoPago,
      estado: this.editBuffer.estado,
      // Mapeamos los detalles tal cual
      detalles: this.editBuffer.detalles.map((d: any) => ({
        zapatillaVariacionId: d.zapatillaVariacionId,
        cantidad: d.cantidad,
        precioTotal: d.precioTotal
      }))
    };

    this.pedidoService.updatePedido(this.editBuffer.id, dto).subscribe({
      next: (pedidoActualizado) => {

        const index = this.pedidos.findIndex(p => p.id === pedidoActualizado.id);

        if (index !== -1) {
          // USAMOS Object.assign PARA MANTENER EL ACORDEÓN ABIERTO
          // Esto copia todas las propiedades nuevas (incluido el nuevo historial) al objeto existente
          Object.assign(this.pedidos[index], pedidoActualizado);

          // Opcional: Si el historial no se refresca, forzamos la referencia del array
          if (pedidoActualizado.historial) {
            this.pedidos[index].historial = [...pedidoActualizado.historial];
          }
        }

        this.cerrarEdicion();
        toast.success('Pedido actualizado correctamente');
      },
      error: (err) => {
        console.error(err);
        toast.error('No se pudo actualizar el pedido');
      }
    });
  }

  // Método helper para limpiar y refrescar vista
  cerrarEdicion() {
    this.editingId = null;
    this.editBuffer = null;
    this.cdr.detectChanges(); // Fuerza a Angular a repintar la vista inmediatamente
  }

  eliminarPedido(id: number) {
    if (!confirm('¿Eliminar este pedido permanentemente?')) return;

    this.pedidoService.deletePedido(id).subscribe({
      next: () => {
        toast.success('Pedido eliminado');
        this.cargarPedidos();
      },
      error: () => toast.error('Error al eliminar')
    });
  }

  // Helper para calcular total
  calcularTotal(pedido: any): number {
    if (!pedido.detalles) return 0;
    return pedido.detalles.reduce((acc: number, item: any) => acc + item.precioTotal, 0);
  }

  get isAdmin(): boolean {
    return this.authService.hasRoles(['ADMIN']);
  }

  get isRepartidor(): boolean {
    return this.authService.hasRoles(['PEDIDOS']);
    // O la lógica que uses para identificarlo
  }

  // Permite editar si tienes cualquiera de los dos roles
  get canEdit(): boolean {
    return this.isAdmin || this.isRepartidor;
  }
}