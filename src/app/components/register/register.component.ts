import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { toast } from 'ngx-sonner';
import { RegisterRequest } from '../../models/auth.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  readonly dialogRef = inject(MatDialogRef<LoginComponent>);

  onCancel() {
    this.dialogRef.close();
  }

  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '400px'
    });
  }

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  // --- Formulario Reactivo ---
  public registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]], // Asumiendo 9 dígitos
    documentNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]], // Asumiendo 8 dígitos
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // --- Getters para validación (opcional pero recomendado) ---
  get nombreControl(): AbstractControl | null { return this.registerForm.get('nombre'); }
  get apellidoControl(): AbstractControl | null { return this.registerForm.get('apellido'); }
  get emailControl(): AbstractControl | null { return this.registerForm.get('email'); }
  get phoneControl(): AbstractControl | null { return this.registerForm.get('phone'); }
  get documentNumberControl(): AbstractControl | null { return this.registerForm.get('documentNumber'); }
  get passwordControl(): AbstractControl | null { return this.registerForm.get('password'); }



  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      toast.error('Por favor, completa el formulario correctamente.');
      return;
    }

    // El formulario es válido, creamos el DTO
    const formValues = this.registerForm.value;

    const request: RegisterRequest = {
      ...formValues,
      documentType: 'DNI'
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        toast.success('¡Registro exitoso! Por favor, inicia sesión.');
        this.onCancel(); // Cerrar el modal de registro
      },
      // Especificar el tipo del error como HttpErrorResponse
      error: (err: HttpErrorResponse) => { 
        console.error('Error en el registro:', err);
        // Comprobar el código de estado (status)
        if (err.status === 403) {
          // Mensaje específico para 403
          toast.error('El correo o DNI ya estan registrados.');
        } else {
          // Mensaje genérico para otros errores (ej. 500)
          toast.error(err.error?.message || 'Error al intentar registrarse.');
        }
      }
    });
  }

}
