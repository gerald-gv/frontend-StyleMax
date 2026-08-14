export interface Direccion {
    id: number;
    usuarioId: number;
    departamento: string;
    provincia: string;
    distrito: string;
    direccionCompleta: string;
    referencia: string | null;
}

export interface ActualizarDireccionRequest {
    departamento: string;
    provincia: string;
    distrito: string;
    direccionCompleta: string;
    referencia: string;
}