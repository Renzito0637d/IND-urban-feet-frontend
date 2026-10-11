import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';

import { AuthService } from '../../services/auth.service';

import { ReclamacionRequest, ReclamacionResponse } from '../../models/reclamo.model';
import { LoginComponent } from '../../components/login/login.component';
import { ReclamoService } from '../../services/reclamos.service';
import { DireccionService } from '../../services/direccion.service';
import { Direccion } from '../../models/direccion.model';

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatDialogModule],
  templateUrl: './reclamos.component.html',
  styleUrl: './reclamos.component.css'
})
export class ReclamosComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private reclamoService = inject(ReclamoService);
  private direccionService = inject(DireccionService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  

  form: FormGroup;
  isLoggedIn = false;
  loading = false;
  listaDirecciones: Direccion[] = [];
  
  misReclamos: ReclamacionResponse[] = [];
  loadingReclamos = false;
  mostrarHistorial = false;

  constructor() {
    this.form = this.fb.group({
      // DATOS CONSUMIDOR
      nombre: [''],
      documento: [''],
      email: [''],
      telefono: [''],
      domicilio: ['', Validators.required],

      // DETALLE RECLAMO
      producto: ['', Validators.required], // Volvemos a input simple
      monto: [null, [Validators.min(0)]],
      tipo: ['', Validators.required],
      detalle: ['', Validators.required],
      solucion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // 1. Verificar estado inicial
    this.verificarSesion();

    // 2. Suscribirse a cambios de sesión (CORREGIDO: usamos isLoggedIn$)
    this.authService.isLoggedIn$.subscribe(isLogged => {
      if (isLogged) {
        this.isLoggedIn = true;
        this.cargarDatosUsuario();
        this.cargarDirecciones();
        this.cargarMisReclamos();
      } else {
        this.isLoggedIn = false;
        this.limpiarDatosUsuario();
        this.listaDirecciones = [];
        this.misReclamos = [];
      }
    });
  }

  verificarSesion() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.cargarDatosUsuario();
    }
  }

  verificarLogin() {
    if (!this.isLoggedIn) {
      this.dialog.open(LoginComponent, {
        width: '400px',
        panelClass: 'custom-dialog'
      });
    }
  }

  cargarDatosUsuario() {
    this.loading = true;
    this.reclamoService.getDatosUsuario().subscribe({
      next: (data) => {
        this.form.patchValue({
          nombre: data.nombre,
          documento: data.documento,
          email: data.correo,
          telefono: data.telefono,
          domicilio: this.form.get('domicilio')?.value || data.domicilio
        });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  limpiarDatosUsuario() {
    this.form.patchValue({
      nombre: '', documento: '', email: '', telefono: ''
    });
  }

  onSubmit() {
    if (!this.isLoggedIn) {
      this.verificarLogin();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      toast.warning('Por favor completa todos los campos obligatorios');
      return;
    }

    this.loading = true;

    // Construimos el objeto con la dirección incluida
    const request: ReclamacionRequest = {
      producto: this.form.get('producto')?.value,
      montoReclamado: this.form.get('monto')?.value || 0,
      tipoMensaje: this.form.get('tipo')?.value,
      detalleReclamo: this.form.get('detalle')?.value,
      solucionPropuesta: this.form.get('solucion')?.value,

      // AQUÍ ESTÁ LA MAGIA:
      // Tomamos el valor del select 'domicilio' (que ya es un string tipo "Calle A, Lima")
      direccion: this.form.get('domicilio')?.value
    };

    this.reclamoService.crearReclamo(request).subscribe({
      next: (resp) => {
        toast.success(`Reclamo #${resp.id} registrado correctamente`);
        this.router.navigate(['/']);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al registrar el reclamo');
        this.loading = false;
      }
    });
  }
  cargarDirecciones() {
    this.direccionService.getAll().subscribe({
      next: (data) => {
        this.listaDirecciones = data;

        // Opcional: Si tiene direcciones, seleccionar la primera por defecto
        if (data.length > 0 && !this.form.get('domicilio')?.value) {
          const dir = data[0];
          // Formateamos la dirección como texto para guardarla
          const direccionTexto = `${dir.calle}, ${dir.distrito}, ${dir.provincia}`;
          this.form.patchValue({ domicilio: direccionTexto });
        }
      },
      error: (err) => console.error('Error cargando direcciones', err)
    });
  }

  cargarMisReclamos() {
    this.loadingReclamos = true;
    this.reclamoService.obtenerMisReclamos().subscribe({
      next: (data) => {
        // Ordenamos por ID descendente (más nuevos primero)
        this.misReclamos = data.sort((a, b) => b.id - a.id);
        this.loadingReclamos = false;
      },
      error: () => this.loadingReclamos = false
    });
  }
  
  // Función para alternar la vista
  toggleHistorial() {
    this.mostrarHistorial = !this.mostrarHistorial;
  }
}