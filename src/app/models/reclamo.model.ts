export interface DatosUsuarioReclamo {
    nombre: string;
    documento: string;
    domicilio: string;
    correo: string;
    telefono: string;
}

export interface ReclamacionRequest {
    producto: string;
    montoReclamado: number;
    tipoMensaje: string;
    detalleReclamo: string;
    solucionPropuesta: string;
    direccion: string;
}

export interface ReclamacionResponse {
    id: number;
    producto: string;
    montoReclamado: number;
    tipoMensaje: string;
    detalleReclamo: string;
    solucionPropuesta: string;
    fechaRegistro: string;
    estado: string;
    direccion?: string;

    nombreUsuario?: string;
    documentoUsuario?: string;
    emailUsuario?: string;
    telefonoUsuario?: string;
}
