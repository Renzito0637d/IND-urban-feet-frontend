import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toast } from 'ngx-sonner';

import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { ClientesComponent } from '../../../components/admin/usuarios/clientes/clientes.component';
import { UsuariosInternosComponent } from '../../../components/admin/usuarios/usuariosinternos/usuariosinternos.component';
import { ChangePasswordComponent } from '../../../components/admin/usuarios/change-password/change-password.component';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, MatTooltipModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush // IMPORTANTE: Requiere uso correcto de cdr
})
export class UsuariosComponent implements OnInit {

  // Servicios
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private reportService = inject(ReportService);

  // --- ESTADO USUARIOS INTERNOS ---
  internalUsers: User[] = [];
  internalPage: number = 0;
  internalTotalPages: number = 0;

  // --- ESTADO CLIENTES ---
  clients: User[] = [];
  clientPage: number = 0;
  clientTotalPages: number = 0;

  // Configuración
  pageSize: number = 5; // Asegúrate de que coincida con tu backend si es fijo

  ngOnInit(): void {
    this.loadInternalUsers();
    this.loadClients();
  }

  // ==========================================
  // LÓGICA USUARIOS INTERNOS
  // ==========================================
  loadInternalUsers() {
    this.userService.getInternalUsers(this.internalPage, this.pageSize).subscribe({
      next: (resp: any) => {
        console.log('Respuesta Internos:', resp);

        this.internalUsers = resp.content || [];

        // BUSQUEDA INTELIGENTE
        const pageInfo = resp.page || resp;

        // CORRECCIÓN 1: Asignar a la variable interna correcta
        this.internalTotalPages = pageInfo.totalPages || 0;

        // Si tienes una variable para totalElements (opcional), úsala aquí:
        // this.internalTotalElements = pageInfo.totalElements || 0;

        console.log('Total Páginas Internas:', this.internalTotalPages);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        toast.error('Error cargando admins');
      }
    });
  }

  // ==========================================
  // LÓGICA CLIENTES
  // ==========================================
  loadClients() {
    this.userService.getClients(this.clientPage, this.pageSize).subscribe({
      next: (resp: any) => {
        console.log('Respuesta Clientes:', resp);

        this.clients = resp.content || [];

        const pageInfo = resp.page || resp;

        // CORRECCIÓN 2: Asignar totalPages (No totalElements)
        this.clientTotalPages = pageInfo.totalPages || 0;

        // ELIMINADO: this.clientTotalPages = pageInfo.totalElements || 0; <--- ESTO CAUSABA EL ERROR VISUAL

        console.log('Total Páginas Clientes:', this.clientTotalPages);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        toast.error('Error cargando clientes');
      }
    });
  }

  changeInternalPage(delta: number) {
    const newPage = this.internalPage + delta;

    // Validar límites antes de llamar al backend
    if (newPage >= 0 && newPage < this.internalTotalPages) {
      this.internalPage = newPage;
      this.loadInternalUsers();
    }
  }

  // ==========================================
  // LÓGICA CLIENTES
  // ==========================================


  changeClientPage(delta: number) {
    const newPage = this.clientPage + delta;

    if (newPage >= 0 && newPage < this.clientTotalPages) {
      this.clientPage = newPage;
      this.loadClients();
    }
  }

  // ==========================================
  // ELIMINAR Y UTILS
  // ==========================================
  deleteUser(id: number | undefined, type: 'internal' | 'client') {
    if (!id) return;

    if (confirm('¿Eliminar usuario definitivamente?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          toast.success('Usuario eliminado');
          // Recargar la lista correcta
          if (type === 'internal') this.loadInternalUsers();
          else this.loadClients();
        },
        error: () => toast.error('Error al eliminar')
      });
    }
  }

  formatRole(role: string): string {
    return role ? role.replace('ROLE_', '') : '';
  }

  // ==========================================
  // MODALES
  // ==========================================
  openDialogFinales(user?: User) {
    const ref = this.dialog.open(UsuariosInternosComponent, { data: user });
    ref.afterClosed().subscribe(res => {
      if (res) this.loadInternalUsers();
    });
  }

  openDialogClie(user?: User) {
    const ref = this.dialog.open(ClientesComponent, { data: user });
    ref.afterClosed().subscribe(res => {
      if (res) this.loadClients();
    });
  }

  openChangePassword(user: User) {
    this.dialog.open(ChangePasswordComponent, { width: '400px', data: user });
  }

  exportarPDF() {
    this.reportService.downloadUsersPdf().subscribe({
      next: (blob: Blob) => {
        // Crear un link temporal en el navegador para forzar la descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Reporte_Usuarios.pdf'; // Nombre del archivo
        a.click();
        window.URL.revokeObjectURL(url); // Limpiar memoria
      },
      error: (err) => {
        console.error('Error descargando PDF', err);
        toast.error('Error al generar el reporte');
      }
    });
  }

  exportarExcel() {
    toast.info('Generando Excel...');
    this.reportService.downloadUsersExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Usuarios_UrbanFeet.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Excel descargado');
      },
      error: () => toast.error('Error al exportar Excel')
    });
  }
}