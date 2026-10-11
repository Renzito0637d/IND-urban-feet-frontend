import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private baseUrl = '/reports';

  // Descargar PDF Usuarios
  downloadUsersPdf() {
    return this.http.get(`${this.baseUrl}/users/pdf`, {
      responseType: 'blob'
    });
  }

  // Descargar PDF Ventas
  downloadSalesPdf() {
    return this.http.get(`${this.baseUrl}/sales/pdf`, {
      responseType: 'blob'
    });
  }

  downloadUsersExcel() {
    return this.http.get(`${this.baseUrl}/users/excel`, {
      responseType: 'blob'
    });
  }

  // Descargar Excel Ventas
  downloadSalesExcel() {
    return this.http.get(`${this.baseUrl}/sales/excel`, {
      responseType: 'blob'
    });
  }
}