export interface PedidoDetalleRequest {
    zapatillaVariacionId: number;
    cantidad: number;
    precioTotal: number; // Precio unitario * cantidad
}

export interface PedidoRequest {
    direccionId: number;
    metodoPago: string;
    detalles: PedidoDetalleRequest[];
}

export interface DireccionEnvio {
    calle: string;
    distrito: string;
    provincia: string;
    departamento: string;
    referencia?: string;
}

export interface PedidoDetalleResponse {
    id: number;
    zapatillaVariacionId: number;
    cantidad: number;
    precioTotal: number;
    nombreProducto: string;
    marca: string;
    color: string;
    tall: string;
}

export interface PedidoResponse {
    id: number;
    usuarioId: number;
    estado: string;
    fechaPedido: string;

    direccionEnvio?: DireccionEnvio;
    detalles: PedidoDetalleResponse[];
    metodoPago: string;

    nombreUsuario?: string;
    apellidoUsuario?: string;
    emailUsuario?: string;
    telefonoUsuario?: string;

    historial?: PedidoHistorial[];
}

export interface PedidoHistorial {
    estado: string;
    fecha: string; // O Date
    usuario: string;
}