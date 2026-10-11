import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 aquí está async pipe

import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ThemetoggleComponent } from '../../components/themetoggle/themetoggle.component';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models/auth.model';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    // Router
    RouterOutlet, RouterLink, RouterLinkActive,
    // Material
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatDividerModule,

    ThemetoggleComponent
  ], templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  @ViewChild('drawer') drawer!: MatSidenav;
  private bp = inject(BreakpointObserver);

  isHandset = this.bp.observe([Breakpoints.Handset, Breakpoints.Tablet]);

  // Útil para cerrar el drawer en móvil tras navegar
  closeIfHandset() {
    this.isHandset.subscribe(s => {
      if (s.matches && this.drawer?.opened) this.drawer.close();
    }).unsubscribe();
  }

  private authService = inject(AuthService); // <--- AÑADIR
  private router = inject(Router); // <--- AÑADIR

  // --- Observables (nuevos) ---
  public currentUser$: Observable<User | null> = this.authService.currentUser$;

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        toast.success('Has cerrado sesión exitosamente.');
        this.router.navigate(['/']); // Redirigir al inicio
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        toast.error('Error al cerrar sesión.');
      }
    });
  }

  hasAccess(user: User | null, allowedRoles: string[]): boolean {
    if (!user || !user.roles) return false;
    // Si el usuario es ADMIN, le damos acceso a todo (retorna true siempre)
    if (user.roles.includes('ROLE_ADMIN')) return true;

    return allowedRoles.some(role => user.roles.includes(role));
  }

}
