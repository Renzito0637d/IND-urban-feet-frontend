export interface SugerenciaRequest {
  asunto: string;
  mensaje: string;
}

export interface SugerenciaResponse {
  id: number;
  asunto: string;
  mensaje: string;
  fechaEnvio: string;
  estado: string;
  userId: number;
}
