import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ZapatillaService } from '../../../../services/zapatilla.service';
import { toast } from 'ngx-sonner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-createzapatilla',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './createzapatilla.component.html',
  styleUrl: './createzapatilla.component.css'
})
export class CreatezapatillaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private zapatillaService = inject(ZapatillaService);
  public dialogRef = inject(MatDialogRef<CreatezapatillaComponent>);
  
  // INYECTAMOS LA DATA (Si existe, es Edición)
  public data = inject(MAT_DIALOG_DATA);

  loading = false;
  isEditMode = false;
  
  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    marca: ['', [Validators.required]],
    tipo: ['Casual', [Validators.required]],
    genero: ['Unisex', [Validators.required]],
    descripcion: ['']
  });

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      // Rellenamos el formulario con los datos recibidos
      this.form.patchValue(this.data);
    }
  }

  isInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.form.value as any;

    // Decidimos si Crear o Actualizar
    const request$: Observable<any> = this.isEditMode
      ? this.zapatillaService.update(this.data.id, formData)
      : this.zapatillaService.create(formData);

    request$.subscribe({
      next: () => {
        toast.success(this.isEditMode ? 'Zapatilla actualizada' : 'Zapatilla creada');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        toast.error('Ocurrió un error');
        this.loading = false;
      }
    });
  }
}