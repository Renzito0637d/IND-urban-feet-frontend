// MeResponse
export interface User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    roles: string[];
}

// AuthenticationRequest
export interface LoginRequest {
    email: string;
    password: string;
}

// RegisterRequest
export interface RegisterRequest {
    nombre: string;
    apellido: string;
    email: string;
    phone: string;
    password: string;
    documentType: string;
    documentNumber: string;
}

// AuthResponse'
// Asumiendo que 'AuthResponse' es el mismo objeto 'User'
// (lo cual es una práctica común y recomendada)
export type AuthResponse = User;