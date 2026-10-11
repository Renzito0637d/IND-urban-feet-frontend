import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import { DocumentType, RoleName } from '../../../../models/user.model';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuariosinternos',
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './usuariosinternos.component.html',
  styleUrl: './usuariosinternos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuariosInternosComponent implements OnInit {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<UsuariosInternosComponent>);

  // INYECTAR DATOS
  public data = inject(MAT_DIALOG_DATA);

  loading = false;
  isEditMode = false;
  errorMessage: string | null = null;

  availableRoles = Object.values(RoleName).filter(r => r !== RoleName.CLIENTE);
  docTypes = Object.values(DocumentType);

  internalForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern('^[0-9]{9,15}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    documentType: [DocumentType.DNI, [Validators.required]],
    documentNumber: ['', [Validators.required, Validators.minLength(8)]],
    role: [RoleName.ADMIN, [Validators.required]]
  });

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;

      // El backend devuelve array de roles, tomamos el primero o default
      const currentRole = (this.data.roles && this.data.roles.length > 0)
        ? this.data.roles[0]
        : RoleName.ADMIN;

      this.internalForm.patchValue({
        ...this.data,
        role: currentRole
      });

      this.internalForm.get('password')?.clearValidators();
      this.internalForm.get('password')?.updateValueAndValidity();
      this.internalForm.get('password')?.disable();
    }
  }

  onSubmit() {
    if (this.internalForm.invalid) {
      this.internalForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    const formData = this.internalForm.getRawValue();

    // 2. AGREGA EL TIPO EXPLICITO : Observable<any> AQUÍ
    const request$: Observable<any> = this.isEditMode
      ? this.userService.updateUser(this.data.id, formData)
      : this.userService.createInternalUser(formData);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        toast.success(this.isEditMode ? 'Usuario actualizado' : 'Usuario creado');
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        toast.error('Error al procesar la solicitud');
        this.errorMessage = 'Error en el servidor.';
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  formatRole(role: string): string {
    return role ? role.replace('ROLE_', '') : '';
  }
}
