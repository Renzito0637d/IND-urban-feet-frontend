import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { DireccionService } from '../../services/direccion.service';
import { Direccion } from '../../models/direccion.model';
import { User, DocumentType } from '../../models/user.model';
import { DireccionFormComponent } from '../../components/direccion-form/direccion-form.component';


@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private direccionService = inject(DireccionService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  loading = false;

  currentUser: User | null = null;
  direcciones: Direccion[] = [];
  loadingDir = true;
  savingProfile = false;

  // Formulario de Perfil
  profileForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    phone: ['', Validators.pattern('^[0-9]{9,15}$')],
    documentType: ['DNI' as DocumentType],
    documentNumber: ['']
  });

  ngOnInit() {
    this.loading = true; // Agrega una variable loading si quieres

    // 1. Nos suscribimos para obtener el ID del usuario logueado
    this.authService.currentUser$.subscribe(authUser => {
      if (authUser && authUser.id) {

        // 2. Pedimos los datos COMPLETOS al backend usando el UserService
        this.userService.getUserById(authUser.id).subscribe({
          next: (fullUser) => {
            this.currentUser = fullUser; // Ahora sí es el tipo completo

            // Llenamos el formulario con los datos frescos de la BD
            this.profileForm.patchValue({
              nombre: fullUser.nombre,
              apellido: fullUser.apellido,
              phone: fullUser.phone,
              documentType: fullUser.documentType,
              documentNumber: fullUser.documentNumber
            });

            this.loadDirecciones();
            this.loading = false;
            this.profileForm.get('documentType')?.disable();
            this.profileForm.get('documentNumber')?.disable();
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
          }
        });
      }
    });
  }

  // --- PERFIL ---

  updateProfile() {
    if (this.profileForm.invalid || !this.currentUser?.id) return;

    this.savingProfile = true;
    const data = this.profileForm.value;

    this.userService.updateUser(this.currentUser.id, data).subscribe({
      next: (updatedUser) => {
        toast.success('Perfil actualizado');
        this.savingProfile = false;
        // Opcional: Actualizar el estado global en AuthService si tienes un método para ello
        // this.authService.refreshUser(updatedUser); 
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al actualizar perfil');
        this.savingProfile = false;
      }
    });
  }

  deleteAccount() {
    if (!this.currentUser?.id) return;

    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.')) {
      this.userService.deleteUser(this.currentUser.id).subscribe({
        next: () => {
          toast.success('Cuenta eliminada. Hasta luego.');
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/']);
          });
        },
        error: () => toast.error('No se pudo eliminar la cuenta')
      });
    }
  }

  // --- DIRECCIONES ---

  loadDirecciones() {
    this.loadingDir = true;
    this.direccionService.getAll().subscribe({
      next: (data) => {
        this.direcciones = data;
        this.loadingDir = false;
      },
      error: () => this.loadingDir = false
    });
  }

  openAddressDialog(direccionToEdit?: Direccion) {
    const dialogRef = this.dialog.open(DireccionFormComponent, {
      width: '500px',
      // Aquí está la clave: Pasamos el objeto dirección al modal
      data: direccionToEdit
    });

    dialogRef.afterClosed().subscribe(result => {
      // Si el modal devuelve true (éxito), recargamos la lista
      if (result === true) {
        this.loadDirecciones();
      }
    });
  }

  deleteAddress(id: number) {
    if (confirm('¿Eliminar esta dirección?')) {
      this.direccionService.delete(id).subscribe({
        next: () => {
          toast.success('Dirección eliminada');
          this.loadDirecciones();
        },
        error: () => toast.error('Error al eliminar')
      });
    }
  }
}