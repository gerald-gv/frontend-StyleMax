export interface LoginRequest {
    correo: string;
    password: string;
}

export interface RegisterRequest {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    telefono?: string;
}

export interface LoginResponse {
    token: string;
    usuarioId: number;
    nombre: string;
    correo: string;
    rol: string;
}