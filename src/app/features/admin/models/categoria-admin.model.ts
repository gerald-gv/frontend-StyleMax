export interface CategoriaAdmin {
    id: number;
    nombre: string;
    activo: boolean;
}

export interface CrearCategoriaRequest {
    nombre: string;
    activo: boolean;
}

export interface ActualizarCategoriaRequest {
    nombre: string;
    activo: boolean;
}

export interface CategoriaEstadisticas {
    total: number;
    activas: number;
    inactivas: number;
}