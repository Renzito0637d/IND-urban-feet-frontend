import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SugerenciaService } from '../../services/sugerencia.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../../components/login/login.component';

// 1. IMPORTAR TOAST DE NGX-SONNER (Directo, sin servicio)
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [FormsModule, MatDialogModule, CommonModule],
  templateUrl: './contactanos.component.html',
  styleUrl: './contactanos.component.css'
})
export class ContactanosComponent implements OnInit {

  asunto: string = "";
  mensaje: string = "";

  nombreUsuario: string = "";
  emailUsuario: string = "";
  estaLogueado: boolean = false;

  private dialog = inject(MatDialog);

  constructor(
    private sugerenciaService: SugerenciaService,
    private authService: AuthService
    // NOTA: Ya no inyectamos ToastrService aquí porque ngx-sonner no lo necesita
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.estaLogueado = true;
        this.nombreUsuario = user.nombre + ' ' + user.apellido;
        this.emailUsuario = user.email;
      } else {
        this.estaLogueado = false;
        this.nombreUsuario = "";
        this.emailUsuario = "";
        this.abrirLogin();
      }
    });
  }

  abrirLogin() {
    if (this.dialog.openDialogs.length === 0) {
      this.dialog.open(LoginComponent, {
        width: '400px',
        disableClose: true
      });
    }
  }

  enviarFormulario() {
    // 1. Validación de seguridad
    if (!this.estaLogueado) {
      // Usamos toast.error para avisar (ngx-sonner se usa directo, sin "this.")
      toast.error("Debes iniciar sesión para enviar un mensaje.");
      this.abrirLogin();
      return;
    }

    // 2. Validación de campos vacíos
    if (!this.asunto || !this.mensaje) {
      toast.error("Por favor complete el asunto y mensaje.");
      return;
    }

    // 3. Envío
    const payload = {
      asunto: this.asunto,
      mensaje: this.mensaje
    };

    this.sugerenciaService.crear(payload).subscribe({
      next: () => {
        // ÉXITO (Color verde/positivo por defecto en sonner)
        toast.success("Mensaje enviado correctamente");

        this.asunto = "";
        this.mensaje = "";
      },
      error: (err) => {
        console.error(err);
        // ERROR (Color rojo)
        if (err.status === 403) {
            toast.error("No tienes permisos. Verifica tu sesión.");
        } else {
            toast.error("Ocurrió un error al enviar el mensaje.");
        }
      }
    });
  }
}
