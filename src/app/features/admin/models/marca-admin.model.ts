export interface MarcaAdmin {
    id: number;
    nombre: string;
    activo: boolean;
}

export interface FormularioMarca {
    nombre: string;
    activo: boolean;
}

export interface CrearMarcaRequest {
    nombre: string;
    activo: boolean;
}

export interface ActualizarMarcaRequest {
    nombre: string;
    activo: boolean;
}