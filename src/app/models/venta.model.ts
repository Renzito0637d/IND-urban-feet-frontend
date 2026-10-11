export interface Venta {
    id: number;
    fecha: string; // "2025-05-13"
    hora: string;  // "15:42:00"
    montoPagado: number;
    metodoPago: string;
    estadoPago: string;
    pedidoId: number;
    nombreUsuario: string;
    apellidoUsuario: string;
    emailUsuario: string;
}