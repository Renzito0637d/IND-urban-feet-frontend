import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para el select
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../services/pedido.service'; // Ajusta ruta
import { PedidoResponse } from '../../models/pedido.model'; // Ajusta ruta
import { MatIconModule } from '@angular/material/icon';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-mispedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './mispedidos.component.html',
  styleUrl: './mispedidos.component.css'
})
export class MispedidosComponent implements OnInit {

  private pedidoService = inject(PedidoService);

  pedidos: PedidoResponse[] = [];
  filteredPedidos: PedidoResponse[] = [];
  loading = true;
  filtroEstado = '';

  estadosOrden = ['PENDIENTE', 'PREPARANDO', 'ENVIADO', 'ENTREGADO'];

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.loading = true;
    this.pedidoService.listarMisPedidos().subscribe({
      next: (data) => {
        // Ordenamos por fecha descendente (más reciente primero)
        this.pedidos = data.sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
        this.filtrar();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filtrar() {
    if (!this.filtroEstado) {
      this.filteredPedidos = this.pedidos;
    } else {
      this.filteredPedidos = this.pedidos.filter(p => p.estado === this.filtroEstado);
    }
  }

  // Helper para saber si un paso del timeline debe estar activo
  isStepActive(pedidoEstado: string, stepIndex: number): boolean {
    const currentIndex = this.estadosOrden.indexOf(pedidoEstado);
    return currentIndex >= stepIndex;
  }

  // Helper para calcular total del pedido
  calcularTotal(pedido: PedidoResponse): number {
    if (!pedido.detalles) return 0;
    return pedido.detalles.reduce((acc, d) => acc + d.precioTotal, 0);
  }

  cancelarPedido(id: number) {
    if (!confirm('¿Estás seguro de que deseas cancelar este pedido? Esta acción restaurará el stock.')) {
      return;
    }

    // Bloqueo visual simple (opcional)
    this.loading = true;

    this.pedidoService.cancelarPedido(id).subscribe({
      next: () => {
        toast.success('Pedido cancelado correctamente');
        // Recargamos la lista para ver el cambio de estado a "CANCELADO"
        this.cargarPedidos();
      },
      error: (err) => {
        console.error(err);
        toast.error('No se pudo cancelar el pedido');
        this.loading = false;
      }
    });
  }
}