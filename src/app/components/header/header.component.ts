import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemetoggleComponent } from '../themetoggle/themetoggle.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models/auth.model';
import { toast } from 'ngx-sonner';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ThemetoggleComponent, CommonModule, MatListModule,
    MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }

  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  private authService = inject(AuthService); // 3. Inyectar AuthService
  private router = inject(Router);

  public isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  public currentUser$: Observable<User | null> = this.authService.currentUser$;

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        toast.success('Has cerrado sesión exitosamente.');
        this.router.navigate(['/']); // Redirigir al inicio
        if (this.isMenuOpen()) {
          this.toggleMenu(); // Cerrar menú móvil si está abierto
        }
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        toast.error('Error al cerrar sesión.');
      },
    });
  }

  isInternal(user: User): boolean {
    if (!user || !user.roles) return false;
    const internalRoles = ['ROLE_ADMIN', 'ROLE_VENTAS', 'ROLE_INVENTARIO', 'ROLE_PEDIDOS'];
    // Verifica si el usuario tiene al menos uno de los roles internos
    return user.roles.some(role => internalRoles.includes(role));
  }

}
