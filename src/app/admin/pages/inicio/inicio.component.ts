import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // 2. Importar RouterModule (para routerLink)
import { forkJoin } from 'rxjs';

import { PedidoService } from '../../../services/pedido.service';
import { ZapatillaService } from '../../../services/zapatilla.service';
import { UserService } from '../../../services/user.service';
import { PedidoResponse } from '../../../models/pedido.model';

type RangeKey = '7d' | '30d' | 'ytd';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  private pedidoService = inject(PedidoService);
  private zapatillaService = inject(ZapatillaService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef); 

  allPedidos: PedidoResponse[] = [];

  totalVentas = 0;
  totalPedidos = 0;
  totalUsuarios = 0;
  totalProductos = 0;

  pedidosRecientes: PedidoResponse[] = [];
  topProductos: { name: string, quantity: number, percentage: number }[] = [];

  labels: (string | number)[] = [];
  data: number[] = [];
  currentRange: RangeKey = '7d';

  palette = { line: '#06b6d4', area: 'rgba(6,182,212,0.25)', grid: '#e5e7eb', ticks: '#404040' };
  readonly W = 100; readonly H = 60;
  readonly chart = { left: 8, right: 98, top: 6, bottom: 52 };
  linePath = ''; areaPath = '';
  points: { x: number, y: number }[] = [];
  gridYs: number[] = [];
  xLabelsLimited: { x: number, label: string | number }[] = [];

  ngOnInit(): void {
    this.updateThemePalette();
    this.cargarDashboard();
  }

  cargarDashboard() {
    forkJoin({
      pedidos: this.pedidoService.getAllAdmin(),
      productosPage: this.zapatillaService.getPaginated(0, 1),
      clientesPage: this.userService.getClients(0, 1)
    }).subscribe({
      next: (res: any) => { 

        this.allPedidos = res.pedidos || [];
        this.totalPedidos = this.allPedidos.length;

        const prodData = res.productosPage;

        this.totalProductos = prodData.page?.totalElements || prodData.totalElements || 0;

        const userData = res.clientesPage;

        this.totalUsuarios = userData.page?.totalElements || userData.totalElements || 0;

        this.totalVentas = this.calcularVentasTotales(this.allPedidos);

        this.procesarPedidosRecientes();
        this.procesarTopProductos();
        this.setRange('7d');

        // 5. ¡IMPORTANTE! Forzar actualización de vista
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando dashboard', err)
    });
  }

  // --- LÓGICA DE PROCESAMIENTO ---

  calcularVentasTotales(pedidos: any[]): number {
    return pedidos
      .filter(p => p.estado !== 'CANCELADO')
      .reduce((acc, p) => {
        // Validación extra por si detalles es null
        if (!p.detalles) return acc;
        const totalPedido = p.detalles.reduce((sum: number, d: any) => sum + d.precioTotal, 0);
        return acc + totalPedido;
      }, 0);
  }

  procesarPedidosRecientes() {
    this.pedidosRecientes = [...this.allPedidos]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }

  procesarTopProductos() {
    const conteo: Record<string, number> = {};

    this.allPedidos.forEach(p => {
      if (p.estado !== 'CANCELADO' && p.detalles) {
        p.detalles.forEach((d: any) => {
          // Intentamos obtener el nombre de varias formas por seguridad
          const nombre = d.nombreProducto || d.producto || 'Producto';
          conteo[nombre] = (conteo[nombre] || 0) + d.cantidad;
        });
      }
    });

    const sorted = Object.entries(conteo)
      .map(([name, quantity]) => ({ name, quantity, percentage: 0 }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const maxQty = sorted[0]?.quantity || 1;
    sorted.forEach(item => item.percentage = (item.quantity / maxQty) * 100);

    this.topProductos = sorted;
  }

  calcularTotalPedido(pedido: any): number {
    return pedido.detalles ? pedido.detalles.reduce((acc: number, item: any) => acc + item.precioTotal, 0) : 0;
  }

  // --- GRÁFICO ---

  onRangeChange(event: any) {
    this.setRange(event.target.value);
  }

  setRange(range: RangeKey) {
    this.currentRange = range;
    const hoy = new Date();
    const mapaVentas: Record<string, number> = {};

    let diasAtras = 7;
    if (range === '30d') diasAtras = 30;
    // if (range === 'ytd') ...

    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() - diasAtras);
    // Ajustar a medianoche para comparación correcta
    fechaLimite.setHours(0, 0, 0, 0);

    const pedidosFiltrados = this.allPedidos.filter(p => {
      if (p.estado === 'CANCELADO') return false;
      const fechaP = new Date(p.fechaPedido);
      return fechaP >= fechaLimite;
    });

    // Ordenar cronológicamente para el gráfico
    pedidosFiltrados.sort((a, b) => new Date(a.fechaPedido).getTime() - new Date(b.fechaPedido).getTime());

    pedidosFiltrados.forEach(p => {
      // Formato DD/MM
      const fecha = new Date(p.fechaPedido).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
      const total = this.calcularTotalPedido(p);
      mapaVentas[fecha] = (mapaVentas[fecha] || 0) + total;
    });

    this.labels = Object.keys(mapaVentas);
    this.data = Object.values(mapaVentas);

    if (this.data.length === 0) {
      this.labels = ['Sin datos'];
      this.data = [0];
    }

    this.updateThemePalette();
    this.computeChart();
  }

  private updateThemePalette() {
    // Verificamos si estamos en navegador para evitar errores de SSR
    if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      this.palette = isDark ? {
        line: '#67e8f9', area: 'rgba(103,232,249,0.25)', grid: '#3f3f46', ticks: '#d4d4d8',
      } : {
        line: '#06b6d4', area: 'rgba(6,182,212,0.25)', grid: '#e5e7eb', ticks: '#404040',
      };
    }
  }

  private computeChart() {
    const { left, right, top, bottom } = this.chart;
    const innerW = right - left;
    const innerH = bottom - top;
    const maxY = Math.max(...this.data) || 100;
    const minY = 0;
    const pad = (maxY - minY) * 0.1;
    const yMax = maxY + pad;
    const yMin = 0;

    const n = this.data.length;
    const stepX = n > 1 ? innerW / (n - 1) : 0;
    const x = (i: number) => n > 1 ? left + i * stepX : (left + right) / 2;

    const y = (val: number) => {
      const t = (val - yMin) / (yMax - yMin || 1);
      return bottom - t * innerH;
    };

    this.points = this.data.map((v, i) => ({ x: x(i), y: y(v) }));

    this.linePath = this.points.reduce((d, p, i) => d + (i === 0 ? `M ${p.x},${p.y}` : ` L ${p.x},${p.y}`), '');

    if (this.points.length) {
      const first = this.points[0];
      const last = this.points[this.points.length - 1];
      this.areaPath = `${this.linePath} L ${last.x},${bottom} L ${first.x},${bottom} Z`;
    } else {
      this.areaPath = '';
    }

    this.gridYs = [top + innerH * 0.25, top + innerH * 0.5, top + innerH * 0.75];

    const maxLabels = 7;
    const stride = Math.ceil(n / maxLabels) || 1;
    this.xLabelsLimited = this.labels.map((lab, i) => ({ x: x(i), label: lab }))
      .filter((_, i) => i % stride === 0);
  }
}