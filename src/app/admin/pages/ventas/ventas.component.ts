import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../../services/venta.service';
import { Venta } from '../../../models/venta.model';
import { MatIconModule } from '@angular/material/icon';
import { ReportService } from '../../../services/report.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css' // Asegúrate que el archivo exista o quítalo
})
export class VentasComponent implements OnInit {
  private ventaService = inject(VentaService);
  private cdr = inject(ChangeDetectorRef);
  private reportService = inject(ReportService);

  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];

  // KPIs
  totalDinero = 0;
  totalVentas = 0;

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';

  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.ventaService.getAll().subscribe({
      next: (data) => {
        this.ventas = data;
        this.aplicarFiltros();

        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  aplicarFiltros() {
    let temp = [...this.ventas];

    if (this.fechaInicio) {
      temp = temp.filter(v => v.fecha >= this.fechaInicio);
    }
    if (this.fechaFin) {
      temp = temp.filter(v => v.fecha <= this.fechaFin);
    }

    this.ventasFiltradas = temp;
    this.calcularKPIs();
  }

  calcularKPIs() {
    // 1. Total de Ventas (Cantidad): Aquí sí contamos todas para saber el volumen de tráfico
    this.totalVentas = this.ventasFiltradas.length;

    // 2. Venta Total (Dinero): SOLO sumamos si NO es reembolsado
    this.totalDinero = this.ventasFiltradas.reduce((acc, venta) => {

      // Si el estado es 'REEMBOLSADO' o 'ANULADO', sumamos 0
      if (venta.estadoPago === 'REEMBOLSADO' || venta.estadoPago === 'ANULADO') {
        return acc + 0;
      }

      // Si es 'COMPLETADO', sumamos el monto
      return acc + venta.montoPagado;
    }, 0);
  }

  exportarPDF() {
    toast.info('Generando reporte PDF...');

    this.reportService.downloadSalesPdf().subscribe({
      next: (blob: Blob) => {
        // Crear enlace temporal para descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Nombre del archivo con fecha actual
        const fecha = new Date().toISOString().split('T')[0];
        a.download = `Reporte_Ventas_${fecha}.pdf`;

        a.click();

        window.URL.revokeObjectURL(url); // Limpiar memoria
        toast.success('Reporte descargado correctamente');
      },
      error: (err) => {
        console.error('Error al exportar PDF:', err);
        toast.error('No se pudo generar el reporte');
      }
    });
  }

  exportarExcel() {
    toast.info('Generando Excel de Ventas...');
    this.reportService.downloadSalesExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Ventas_UrbanFeet.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Excel descargado');
      },
      error: () => toast.error('Error al exportar Excel')
    });
  }
}