import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ZapatillaService } from '../../../services/zapatilla.service';
import { Zapatilla } from '../../../models/zapatilla.model';
import { CreatezapatillaComponent } from '../../../components/admin/zapatillas/createzapatilla/createzapatilla.component';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { Page } from '../../../models/page.model';

@Component({
  selector: 'app-zapatillas',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './zapatillas.component.html',
  styleUrl: './zapatillas.component.css'
})
export class ZapatillasComponent implements OnInit {

  private zapatillaService = inject(ZapatillaService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  zapatillas: Zapatilla[] = [];
  loading = true;

  currentPage = 0;
  pageSize = 8; // Muestra 8 zapatillas por página en Admin (2 filas de 4)
  totalPages = 0;
  totalElements = 0;
  isFirst = true;
  isLast = false;
  pageNumbers: number[] = [];

  ngOnInit() {
    this.loadZapatillas();
  }

  loadZapatillas() {
    this.loading = true;

    this.zapatillaService.getPaginated(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => { // Usamos 'any' para evitar errores de tipo rápido
        
        // 1. Contenido
        this.zapatillas = data.content;

        // 2. Metadatos (CORREGIDO: accedemos a data.page)
        // Usamos el operador ?. por si acaso 'page' no venga en alguna respuesta rara
        this.totalPages = data.page?.totalPages || 0;
        this.totalElements = data.page?.totalElements || 0;
        
        // 3. Calculamos isFirst / isLast manualmente porque tu JSON no los trae directos
        const pageNumber = data.page?.number || 0;
        this.isFirst = pageNumber === 0;
        this.isLast = pageNumber === (this.totalPages - 1);

        this.generarNumerosPagina();
        
        this.loading = false;
        this.cdr.markForCheck();
        
        if (this.currentPage > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // --- MÉTODOS DE CONTROL ---

  cambiarPagina(page: number) {
    if (page < 0 || page >= this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadZapatillas();
  }

  siguiente() {
    if (!this.isLast) this.cambiarPagina(this.currentPage + 1);
  }

  anterior() {
    if (!this.isFirst) this.cambiarPagina(this.currentPage - 1);
  }

  generarNumerosPagina() {
    // Lógica simple: muestra todas. Si son muchas, necesitarás lógica de "..."
    this.pageNumbers = Array(this.totalPages).fill(0).map((x, i) => i);
  }

  openCreateDialog(zapatillaToEdit?: Zapatilla) {
    const ref = this.dialog.open(CreatezapatillaComponent, {
      width: 'auto', // O el ancho que prefieras
      data: zapatillaToEdit // Pasamos el objeto aquí (si es undefined, crea)
    });

    ref.afterClosed().subscribe(result => {
      if (result === true) this.loadZapatillas();
    });
  }

  // Método helper para obtener la imagen principal (o una por defecto)
  getMainImage(zap: Zapatilla): string {
    if (zap.variaciones && zap.variaciones.length > 0 && zap.variaciones[0].imageUrl) {
      return zap.variaciones[0].imageUrl;
    }
    // Imagen placeholder si no tiene variaciones aún
    return '/img/sinvar.jpg'; // Asegúrate de tener una imagen aquí o usa una URL externa
  }

  // Helper para calcular stock total
  getTotalStock(zap: Zapatilla): number {
    if (!zap.variaciones) return 0;
    return zap.variaciones.reduce((acc, curr) => acc + curr.stock, 0);
  }

  deleteZapatilla(zap: Zapatilla) {
    if (!zap.id) return;

    if (confirm(`¿Estás seguro de eliminar el modelo "${zap.nombre}"? Se borrará todo su stock y variaciones.`)) {
      this.loading = true; // Mostramos loading visualmente si quieres

      this.zapatillaService.delete(zap.id).subscribe({
        next: () => {
          toast.success('Zapatilla eliminada correctamente');
          this.loadZapatillas(); // Recargamos la lista
        },
        error: (err) => {
          console.error(err);
          toast.error('No se pudo eliminar. Verifique si tiene pedidos asociados.');
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  openVariaciones(zap: Zapatilla) {
    // Navegar a la nueva vista
    this.router.navigate(['/admin/zapatillas', zap.id]);
  }
}
