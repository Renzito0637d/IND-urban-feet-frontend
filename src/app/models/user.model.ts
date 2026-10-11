export enum RoleName {
  CLIENTE = 'CLIENTE',
  ADMIN = 'ADMIN',
  PEDIDOS = 'PEDIDOS',
  INVENTARIO = 'INVENTARIO',
  VENTAS = 'VENTAS'
}

export enum DocumentType {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
  CE = 'CE'
}

export interface User {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  phone?: string;
  active: boolean;
  documentType: DocumentType;
  documentNumber: string;
  roles: RoleName[]; // Set<RoleName> viene como array en JSON
  password?: string; // Solo para enviar al crear, no suele venir en el GET
}

// Interfaz para mapear la respuesta Page<User> de Spring Boot
export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> {
  content: T[];          // La lista de usuarios
  totalPages: number;    // Total de páginas
  totalElements: number; // <--- AGREGA ESTA LÍNEA (Es la que te falta)
  last: boolean;
  size: number;
  number: number;        // Página actual
  first?: boolean;
  empty?: boolean;
}

// Interfaz para el Request de creación (RegisterRequest)
export interface UserRequest {
  nombre: string;
  apellido: string;
  email: string;
  phone: string;
  password: string;
  documentType: DocumentType;
  documentNumber: string;
  role: RoleName;
}