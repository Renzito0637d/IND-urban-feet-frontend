import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ZapatillaService } from '../../services/zapatilla.service'; // Asegúrate de importar la Interfaz
import { Zapatilla, ZapatillaFilter } from '../../models/zapatilla.model';
import { ProductoDetalleComponent } from '../../components/producto-detalle/producto-detalle.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {

  private zapatillaService = inject(ZapatillaService);
  readonly dialog = inject(MatDialog);

  zapatillas: Zapatilla[] = [];
  loading = true;
  showMobileFilters = false;

  // Paginación
  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  totalElements = 0;
  isFirst = true;
  isLast = false;
  pageNumbers: number[] = [];

  // Filtros (Tipados como ZapatillaFilter para evitar errores)
  filtros: ZapatillaFilter = {
    marcas: [],
    genero: '',
    tipo: '',
    talla: null as string|null,
    min: null,
    max: null
  };

  // Listas auxiliares para la vista
  marcasList = ['Nike', 'Adidas', 'Atletix', 'New Athletic', 'I-run', 'Punto'];
  tallasList = ['38', '39', '40', '41', '42', '43'];

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    this.loading = true;

    // Ahora TypeScript no se quejará porque la interfaz acepta null
    this.zapatillaService.getPaginatedPublic(this.currentPage, this.pageSize, this.filtros).subscribe({
      next: (data: any) => {
        this.zapatillas = data.content || [];

        const pageInfo = data.page;
        if (pageInfo) {
          this.totalPages = pageInfo.totalPages;
          this.totalElements = pageInfo.totalElements;
          const currentNum = pageInfo.number || 0;
          this.isFirst = currentNum === 0;
          this.isLast = currentNum === (this.totalPages - 1);
        } else {
          this.totalPages = 0;
        }

        this.generarNumerosPagina();
        this.loading = false;

        if (this.currentPage > 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (err) => {
        console.error('Error al cargar catálogo:', err);
        this.loading = false;
      }
    });
  }

  // --- MÉTODOS DE FILTRADO (Faltaban en tu código) ---

  toggleMarca(marca: string, event: any) {
    if (!this.filtros.marcas) this.filtros.marcas = [];

    if (event.target.checked) {
      this.filtros.marcas.push(marca);
    } else {
      this.filtros.marcas = this.filtros.marcas.filter(m => m !== marca);
    }
  }

  seleccionarTalla(t: string) {
    // Si ya estaba seleccionada, la quitamos (toggle), si no, la ponemos
    this.filtros.talla = this.filtros.talla === t ? null : t;
  }

  seleccionarTipo(tipo: string) {
    this.filtros.tipo = this.filtros.tipo === tipo ? '' : tipo;
  }

  aplicarFiltros() {
    this.currentPage = 0; // Resetear a página 1
    this.loadProductos();
    this.showMobileFilters = false;
  }

  limpiarFiltros() {
    this.filtros = {
      marcas: [],
      genero: '',
      tipo: '',
      talla: null,
      min: null,
      max: null
    };
    this.aplicarFiltros();
  }

  // --- PAGINACIÓN ---

  cambiarPagina(pagina: number) {
    if (pagina < 0 || pagina >= this.totalPages || pagina === this.currentPage) return;
    this.currentPage = pagina;
    this.loadProductos();
  }

  siguientePagina() {
    if (!this.isLast) this.cambiarPagina(this.currentPage + 1);
  }

  anteriorPagina() {
    if (!this.isFirst) this.cambiarPagina(this.currentPage - 1);
  }

  generarNumerosPagina() {
    this.pageNumbers = Array(this.totalPages).fill(0).map((x, i) => i);
  }

  // --- HELPERS VISUALES ---

  openDialog(zapatilla: Zapatilla): void {
    this.dialog.open(ProductoDetalleComponent, {
      width: '1000px',
      maxWidth: '100vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: zapatilla
    });
  }

  getDisplayImage(zap: Zapatilla): string {
    if (zap.variaciones && zap.variaciones.length > 0) {
      const v = zap.variaciones.find(v => v.imageUrl);
      return v ? v.imageUrl! : '/assets/img/placeholder.png'; // Ajusté ruta a assets/img por estándar
    }
    return '/assets/img/placeholder.png';
  }

  getDisplayPrice(zap: Zapatilla): number {
    if (zap.variaciones && zap.variaciones.length > 0) {
      return zap.variaciones[0].precio;
    }
    return 0;
  }
}