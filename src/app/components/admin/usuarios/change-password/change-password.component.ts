import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<ChangePasswordComponent>);
  public data = inject(MAT_DIALOG_DATA); // Recibe el usuario completo

  loading = false;
  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    this.userService.changePassword(this.data.id, this.form.value.password!).subscribe({
      next: () => {
        toast.success('Contraseña actualizada correctamente');
        this.dialogRef.close();
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al actualizar contraseña');
        this.loading = false;
      }
    });
  }

  onCancel() { this.dialogRef.close(); }
}