import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ZapatillaService } from '../../../services/zapatilla.service';
import { VariacionesService } from '../../../services/variaciones.service';
import { Zapatilla } from '../../../models/zapatilla.model';
import { Variacion } from '../../../models/variaciones.model';
import { CreatevariacionComponent } from '../../../components/admin/zapatillas/createvariacion/createvariacion.component';
import { toast } from 'ngx-sonner';

// El modal que crearemos abajo

@Component({
  selector: 'app-variaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './variaciones.component.html',
  styleUrl: './variaciones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VariacionesComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private zapatillaService = inject(ZapatillaService);
  private variacionService = inject(VariacionesService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  zapatillaId!: number;
  zapatilla: Zapatilla | null = null;
  variaciones: Variacion[] = [];
  loading = true;

  ngOnInit() {
    // 1. Obtener ID de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.zapatillaId = +id;
        this.loadData();
      }
    });
  }

  loadData() {
    this.loading = true;

    // Carga paralela de Zapatilla y sus Variaciones
    // (Podrías usar forkJoin, pero así es más legible por ahora)
    this.zapatillaService.getById(this.zapatillaId).subscribe({
      next: (zap) => {
        this.zapatilla = zap;
        this.cdr.markForCheck();
      }
    });

    this.loadVariaciones();
  }

  loadVariaciones() {
    this.variacionService.getByZapatillaId(this.zapatillaId).subscribe({
      next: (vars) => {
        this.variaciones = vars;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openCreateDialog() {
    const ref = this.dialog.open(CreatevariacionComponent, {
      width: '500px',
      data: { zapatillaId: this.zapatillaId }
    });

    ref.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadVariaciones();
      }
    });
  }

  openEditDialog(variacion: Variacion) {
    const ref = this.dialog.open(CreatevariacionComponent, {
      width: '500px',
      data: variacion
    });

    ref.afterClosed().subscribe(result => {
      if (result === true) this.loadVariaciones();
    });
  }

  deleteVariacion(variacion: Variacion) {
    if (!variacion.id) return;

    if (confirm(`¿Eliminar la variación ${variacion.color} - Talla ${variacion.talla}?`)) {
      this.variacionService.delete(variacion.id).subscribe({
        next: () => {
          toast.success('Variación eliminada');
          this.loadVariaciones();
        },
        error: (err) => {
          console.error(err);
          toast.error('No se pudo eliminar');
        }
      });
    }
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