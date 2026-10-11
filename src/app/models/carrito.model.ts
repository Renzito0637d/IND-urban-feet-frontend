export interface CarritoItemRequest {
    zapatillaVariacionId: number;
    cantidad: number;
}

export interface CarritoItemResponse {
    id: number;
    cantidad: number;
    variacionId: number;
    precioUnitario: number;
}

export interface CarritoItem {
    id: number;
    cantidad: number;
    zapatilla_variacion: {
        id: number;
        color: string;
        talla: string;
        precio: number;
        imageUrl: string;
        stock: number;
        zapatilla: {
            id: number;
            nombre: string;
            marca: string;
        };
    };
}

export interface CarritoItemDetail {
    id: number;
    cantidad: number;
    subtotal: number;

    // Datos planos que vienen del DTO nuevo
    variacionId: number;
    color: string;
    talla: string;
    precioUnitario: number;
    imageUrl: string;
    stockDisponible: number;
    nombreProducto: string;
    marca: string;
}

export interface Carrito {
    id: number;
    totalEstimado: number;
    items: CarritoItemDetail[]; // Usamos la nueva interfaz
}