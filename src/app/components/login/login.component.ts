import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from '../header/header.component';
import { RegisterComponent } from '../register/register.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly dialogRef = inject(MatDialogRef<HeaderComponent>);

  onCancel() {
    this.dialogRef.close();
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(RegisterComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Inyectamos los servicios que necesitamos
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Creamos el formulario reactivo
  public loginForm: FormGroup = this.fb.group({
    // El primer string es el valor por defecto y validadores
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get emailControl(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      if (this.emailControl?.invalid) {
        if (this.emailControl.hasError('required')) {
          toast.error('El correo no puede estar vacío.');
          return;
        }

        if (this.emailControl.hasError('email')) {
          toast.error('El formato del correo no es válido.');
          return;
        }
      }

      if (this.passwordControl?.invalid) {
        if (this.passwordControl.hasError('required')) {
          toast.error('La contraseña no puede estar vacío.');
          return;
        }
      }

      toast.error('Por favor, completa el formulario correctamente.');
      return;
    }

    // Creamos el DTO (Request) desde los valores del formulario
    const credentials: LoginRequest = this.loginForm.value;

    console.log('Llamando al servicio de login con credenciales:', credentials);
    this.authService.login(credentials).subscribe({
      // Manejamos el ÉXITO
      next: (user) => {
        // El login fue exitoso, 'user' es el objeto que devolvió el backend.
        // El servicio (AuthService) ya guardó el estado.
        // Ahora, redirigimos al usuario
        console.log('Login exitoso:', user);
        toast.success('Login exitoso');
        this.onCancel();

        if (this.authService.hasRoles(['ADMIN', 'PEDIDOS', 'INVENTARIO', 'VENTAS'])) {
          // Si es ADMIN, lo mandamos al dashboard de admin
          this.router.navigate(['/admin']);
        } else {
          // Opcional: si es CLIENTE, puedes mandarlo a sus pedidos o al inicio
          // this.router.navigate(['/pedidos']);
          // Si no pones nada, simplemente se quedará en la página actual (sin el modal)
        }

      },
      // Manejamos el ERROR
      error: (err) => {
        // El login falló (ej. 401 Credenciales incorrectas)
        console.error('Error en el login:', err);
        toast.error('Error en el login: ' + (err.error?.message || 'Credenciales incorrectas'));
      }
    });

  }
}
