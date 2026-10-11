export interface ZapatillaVariacion {
  id?: number;
  color: string;
  imageUrl?: string;
  precio: number;
  stock: number;
  talla: string;
}

export interface Zapatilla {
  id?: number;
  nombre: string;
  descripcion: string;
  marca: string;
  genero: string; // Hombre, Mujer, Unisex
  tipo: string;   // Deportiva, Casual, etc.
  variaciones?: ZapatillaVariacion[];
  stockTotal?: number; // Calculado en el front o viene del back si usas getter
}

// DTO para crear (sin ID ni variaciones)
export interface ZapatillaRequest {
  nombre: string;
  descripcion: string;
  marca: string;
  genero: string;
  tipo: string;
}

export interface ZapatillaFilter {
  marcas?: string[];
  genero?: string;
  tipo?: string;
  talla?: string | null; // <--- Agrega | null
  min?: number | null;   // <--- Agrega | null
  max?: number | null;
}