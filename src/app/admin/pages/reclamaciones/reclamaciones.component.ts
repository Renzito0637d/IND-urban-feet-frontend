import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

import { ReclamacionResponse } from '../../../models/reclamo.model';
import { ReclamoService } from '../../../services/reclamos.service';

@Component({
  selector: 'app-reclamaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamaciones.component.html',
  styleUrl: './reclamaciones.component.css'
})
export class ReclamacionesComponent implements OnInit {

  private reclamoService = inject(ReclamoService);
  private cdr = inject(ChangeDetectorRef);

  allReclamos: ReclamacionResponse[] = [];
  reclamos: ReclamacionResponse[] = [];
  loading = true;

  // Variables de filtros
  filtroEstado = 'Todos';
  filtroTipo = 'Todos';

  ngOnInit() {
    this.cargarReclamos();
  }

  cargarReclamos() {
    this.loading = true;
    this.reclamoService.obtenerTodos().subscribe({
      next: (data) => {
        // Ordenamos por ID descendente
        this.allReclamos = data.sort((a, b) => b.id - a.id);

        // Aplicamos el filtro inmediatamente
        this.aplicarFiltro();

        this.loading = false;

        // 4. FORZAR LA DETECCIÓN DE CAMBIOS
        // Esto le dice a Angular: "Oye, ya tengo los datos, pinta la vista ahora"
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al cargar reclamaciones');
      }
    });
  }

  aplicarFiltro() {
    this.reclamos = this.allReclamos.filter(r => {
      // 1. Filtro Estado
      const matchEstado = this.filtroEstado === 'Todos' || r.estado === this.filtroEstado;

      // 2. Filtro Tipo
      const matchTipo = this.filtroTipo === 'Todos' || r.tipoMensaje === this.filtroTipo;

      return matchEstado && matchTipo;
    });
  }

  cambiarEstado(id: number, nuevoEstado: string, reclamoActual: ReclamacionResponse) {
    // Preparamos el objeto para actualizar (manteniendo los otros datos)
    // Nota: Como tu backend pide todo el objeto en el PUT, construimos el DTO simple
    const dtoUpdate = {
      producto: reclamoActual.producto,
      montoReclamado: reclamoActual.montoReclamado,
      tipoMensaje: reclamoActual.tipoMensaje,
      detalleReclamo: reclamoActual.detalleReclamo,
      solucionPropuesta: reclamoActual.solucionPropuesta,
      direccion: reclamoActual.direccion,
      estado: nuevoEstado // <-- Lo que cambiamos
    };

    this.reclamoService.actualizar(id, dtoUpdate).subscribe({
      next: () => {
        toast.success('Estado actualizado');
        // No recargamos toda la lista para no perder la posición, solo actualizamos memoria
        reclamoActual.estado = nuevoEstado;
      },
      error: () => toast.error('Error al actualizar estado')
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    this.reclamoService.eliminar(id).subscribe({
      next: () => {
        toast.success('Registro eliminado');
        this.cargarReclamos(); // Recargar lista
      },
      error: () => toast.error('Error al eliminar')
    });
  }
}