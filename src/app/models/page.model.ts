export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number; // Número de página actual (empieza en 0)
    first: boolean;
    empty: boolean;
}