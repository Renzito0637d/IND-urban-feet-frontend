import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para *ngFor
import { PedidoService } from '../../services/pedido.service'; // Ajusta la ruta

// Interfaz para facilitar el manejo en la vista
interface TopZapatilla {
  nombre: string;
  marca: string;     // Para la etiqueta pequeña (ej: RUNNING/NIKE)
  tipo: string;      // Opcional, si tienes categoría
  imgUrl: string;
  cantidad: number;  // Para ordenar
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  private pedidoService = inject(PedidoService);

  topZapatillas: TopZapatilla[] = [];
  loading = true;

  ngOnInit() {
    this.calcularTopVentas();
  }

  calcularTopVentas() {
    this.pedidoService.getAllAdmin().subscribe({
      next: (pedidos) => {
        const conteo: Record<string, TopZapatilla> = {};

        // 1. Recorrer pedidos no cancelados
        pedidos.forEach(p => {
          if (p.estado !== 'CANCELADO' && p.detalles) {
            p.detalles.forEach((d: any) => {
              // Intentamos obtener el nombre único
              // Asegúrate de que 'd' tenga acceso a la info de la zapatilla (nombre, img, marca)
              // Dependiendo de tu DTO, puede estar en d.nombreProducto o d.zapatillaVariacion.zapatilla...
              
              // Ajusta estas rutas según tu DTO real de PedidoDetalle:
              const nombre = d.nombreProducto || 'Producto';
              const marca = d.marca || 'GENÉRICO'; // O d.zapatillaVariacion.zapatilla.marca
              const img = d.imgUrl || '/assets/img/placeholder.png'; // O la ruta de tu imagen
              const tipo = d.tipo || 'CALZADO';

              // Usamos el nombre como clave para agrupar
              if (!conteo[nombre]) {
                conteo[nombre] = {
                  nombre: nombre,
                  marca: marca,
                  tipo: tipo,
                  imgUrl: img,
                  cantidad: 0
                };
              }
              
              conteo[nombre].cantidad += d.cantidad;
            });
          }
        });

        // 2. Convertir a array, ordenar y tomar los 3 primeros
        this.topZapatillas = Object.values(conteo)
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 3);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error calculando top ventas', err);
        this.loading = false;
      }
    });
  }
}