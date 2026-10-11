import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { toast } from 'ngx-sonner';
import { DireccionService } from '../../services/direccion.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-direccion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './direccion-form.component.html'
})
export class DireccionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private direccionService = inject(DireccionService);
  public dialogRef = inject(MatDialogRef<DireccionFormComponent>);

  // INYECTAMOS LA DATA: Aquí llega la dirección si es edición
  public data = inject(MAT_DIALOG_DATA);

  loading = false;
  isEditMode = false;

  form = this.fb.group({
    departamento: ['', Validators.required],
    provincia: ['', Validators.required],
    distrito: ['', Validators.required],
    calle: ['', Validators.required],
    referencia: ['']
  });

  ngOnInit(): void {
    // Si 'data' tiene contenido, activamos modo edición y rellenamos campos
    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue(this.data); // Rellena el formulario automáticamente
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    // Decidimos qué método del servicio llamar
    const request$ = this.isEditMode
      ? this.direccionService.update(this.data.id, this.form.value as any) // PUT
      : this.direccionService.create(this.form.value as any);              // POST

    request$.subscribe({
      next: () => {
        toast.success(this.isEditMode ? 'Dirección actualizada' : 'Dirección agregada');
        this.dialogRef.close(true); // Cerramos devolviendo true
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al guardar la dirección');
        this.loading = false;
      }
    });
  }
}