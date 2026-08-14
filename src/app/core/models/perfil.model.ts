export interface Perfil {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
}

export interface ActualizarPerfilRequest {
    nombre: string;
    apellido: string;
    telefono: string;
}
