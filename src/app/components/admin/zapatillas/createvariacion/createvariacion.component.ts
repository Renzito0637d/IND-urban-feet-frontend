import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { Observable } from 'rxjs';
import { VariacionesService } from '../../../../services/variaciones.service';

@Component({
  selector: 'app-createvariacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './createvariacion.component.html'
})
export class CreatevariacionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private variacionService = inject(VariacionesService);
  public dialogRef = inject(MatDialogRef<CreatevariacionComponent>);

  public data = inject(MAT_DIALOG_DATA);

  loading = false;
  isEditMode = false;
  imagePreview: string | null = null;

  form: FormGroup = this.fb.group({
    color: ['', [Validators.required]],
    talla: ['', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['']
  });

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.isEditMode = true;
      this.form.patchValue(this.data);
      if (this.data.imageUrl) {
        this.imagePreview = this.data.imageUrl;
      }
    }

    this.form.get('imageUrl')?.valueChanges.subscribe((url: string) => {
      const trimmed = (url || '').trim();
      this.imagePreview = trimmed || null;
    });
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
    const rawValue = {
      ...this.form.value,
      imageUrl: (this.form.value.imageUrl || '').trim()
    };

    let request$: Observable<any>;

    if (this.isEditMode) {
      request$ = this.variacionService.update(this.data.id, rawValue);
    } else {
      if (!this.data.zapatillaId) {
        toast.error('Error: No se identificó la zapatilla padre');
        this.loading = false;
        return;
      }

      const tallasArray = rawValue.talla.toString()
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t !== '');

      if (tallasArray.length === 0) {
        toast.error('Debes ingresar al menos una talla válida');
        this.loading = false;
        return;
      }

      const payload = {
        color: rawValue.color,
        precio: rawValue.precio,
        stock: rawValue.stock,
        imageUrl: rawValue.imageUrl || null,
        tallas: tallasArray
      };

      request$ = this.variacionService.create(this.data.zapatillaId, payload);
    }

    request$.subscribe({
      next: () => {
        toast.success(this.isEditMode ? 'Variación actualizada' : 'Variaciones agregadas correctamente');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        toast.error('Ocurrió un error al guardar');
        this.loading = false;
      }
    });
  }
}
