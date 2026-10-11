export interface Variacion {
    id?: number;
    color: string;
    talla: string;
    precio: number;
    stock: number;
    imageUrl?: string;
    zapatillaId?: number; // Para enviar al crear
}