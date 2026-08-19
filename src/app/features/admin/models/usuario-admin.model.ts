export interface UsuarioAdmin {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
    activo: boolean;
    rolId: number;
    rol: string;
    direccion: DireccionUsuario | null;
}


export interface DireccionUsuario {
    id: number;
    usuarioId: number;
    departamento: string;
    provincia: string;
    distrito: string;
    direccionCompleta: string;
    referencia: string | null;
}


export interface FormularioUsuario {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
}


export interface ActualizarUsuarioRequest {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
}


export interface RestablecerPasswordRequest {
    nuevaPassword: string;
}