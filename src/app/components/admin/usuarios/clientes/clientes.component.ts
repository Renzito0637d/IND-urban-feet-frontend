import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import { DocumentType } from '../../../../models/user.model';
import { Observable } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<ClientesComponent>);

  // INYECTAR DATOS: Si es null = Crear, Si tiene objeto = Editar
  public data = inject(MAT_DIALOG_DATA);

  loading = false;
  isEditMode = false;
  errorMessage: string | null = null;
  docTypes = Object.values(DocumentType);

  clientForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern('^[0-9]{9,15}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    documentType: [DocumentType.DNI, [Validators.required]],
    documentNumber: ['', [Validators.required, Validators.minLength(8)]]
  });

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;

      // 1. Rellenar formulario
      this.clientForm.patchValue(this.data);

      // 3. La contraseña no es obligatoria al editar (a menos que quieras cambiarla)
      this.clientForm.get('password')?.clearValidators();
      this.clientForm.get('password')?.updateValueAndValidity();
      this.clientForm.get('password')?.disable(); // Ocultamos visualmente o deshabilitamos
    }
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const formData = this.clientForm.getRawValue();

    // 2. AGREGA EL TIPO EXPLICITO : Observable<any> AQUÍ
    const request$: Observable<any> = this.isEditMode
      ? this.userService.updateUser(this.data.id, formData)
      : this.userService.createClient(formData);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        toast.success(this.isEditMode ? 'Cliente actualizado' : 'Cliente registrado');
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        toast.error('Ocurrió un error al procesar la solicitud');
        this.errorMessage = 'Error en el servidor.';
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
