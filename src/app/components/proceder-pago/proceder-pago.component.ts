import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { DireccionService } from '../../services/direccion.service';
import { PedidoService } from '../../services/pedido.service';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItemDetail } from '../../models/carrito.model';
import { Direccion } from '../../models/direccion.model';
import { PedidoDetalleRequest, PedidoRequest } from '../../models/pedido.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-proceder-pago',
  standalone: true,
  imports: [RouterLink,CommonModule, MatDialogModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './proceder-pago.component.html'
})
export class ProcederPagoComponent implements OnInit {

  private dialogRef = inject(MatDialogRef<ProcederPagoComponent>);
  private direccionService = inject(DireccionService);
  private pedidoService = inject(PedidoService);
  private carritoService = inject(CarritoService);
  private fb = inject(FormBuilder);

  public itemsCarrito: CarritoItemDetail[] = inject(MAT_DIALOG_DATA);

  direcciones: Direccion[] = [];
  loadingDir = true;
  procesandoPago = false;
  totalPagar = 0;

  form = this.fb.group({
    direccionId: [null as number | null, Validators.required],
    metodoPago: ['TARJETA', Validators.required],
    // Campos ficticios (inicialmente requeridos porque el default es TARJETA)
    numeroTarjeta: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
    fechaVencimiento: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]], // MM/YY
    cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
  });

  ngOnInit(): void {
    this.loadDirecciones();
    this.calcularTotal();

    this.form.get('metodoPago')?.valueChanges.subscribe(metodo => {
      this.actualizarValidadores(metodo);
    });
  }

  loadDirecciones() {
    this.loadingDir = true;
    this.direccionService.getAll().subscribe({
      next: (data) => {
        this.direcciones = data;
        this.loadingDir = false;

        if (data.length > 0 && data[0].id) {
          this.form.patchValue({ direccionId: data[0].id });
        }
      },
      error: () => {
        toast.error('Error al cargar direcciones');
        this.loadingDir = false;
      }
    });
  }

  actualizarValidadores(metodo: string | null) {
    const tarjetaControls = ['numeroTarjeta', 'fechaVencimiento', 'cvv'];

    if (metodo === 'TARJETA') {
      tarjetaControls.forEach(ctrl => {
        this.form.get(ctrl)?.setValidators([Validators.required]); // O tus patrones
        this.form.get(ctrl)?.enable();
        this.form.get(ctrl)?.updateValueAndValidity();
      });
    } else {
      // Si es Yape o Plin, quitamos la obligación de llenar estos campos
      tarjetaControls.forEach(ctrl => {
        this.form.get(ctrl)?.clearValidators();
        this.form.get(ctrl)?.disable(); // Opcional: deshabilita los inputs
        this.form.get(ctrl)?.updateValueAndValidity();
      });
    }
  }

  calcularTotal() {
    this.totalPagar = this.itemsCarrito.reduce((acc, item) =>
      acc + (item.precioUnitario * item.cantidad), 0
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      toast.warning('Por favor selecciona una dirección de envío');
      return;
    }

    this.procesandoPago = true;

    // 1. Preparar el objeto Request para el Backend
    const detalles: PedidoDetalleRequest[] = this.itemsCarrito.map(item => ({
      zapatillaVariacionId: item.variacionId,
      cantidad: item.cantidad,
      precioTotal: item.precioUnitario * item.cantidad
    }));

    const pedidoRequest: PedidoRequest = {
      direccionId: this.form.value.direccionId!,
      metodoPago: this.form.value.metodoPago!, // Enviamos el método
      detalles: detalles
    };

    // 2. Llamar al servicio de Pedidos
    this.pedidoService.crearPedido(pedidoRequest).subscribe({
      next: (resp) => {
        toast.success(`Pedido #${resp.id} creado con éxito!`);

        // 3. LIMPIEZA SINCRONIZADA
        // Creamos un array de observables (peticiones pendientes)
        const deleteRequests = this.itemsCarrito.map(item => 
            this.carritoService.deleteItem(item.id)
        );

        if (deleteRequests.length > 0) {
            // forkJoin espera a que TODAS las peticiones terminen
            forkJoin(deleteRequests).subscribe({
                next: () => {
                    // Ahora sí, ya está vacío en BD
                    this.procesandoPago = false;
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    console.error("Error vaciando carrito", err);
                    // Cerramos igual, porque el pedido sí se creó
                    this.procesandoPago = false;
                    this.dialogRef.close(true); 
                }
            });
        } else {
            this.procesandoPago = false;
            this.dialogRef.close(true);
        }
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al procesar el pedido');
        this.procesandoPago = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}