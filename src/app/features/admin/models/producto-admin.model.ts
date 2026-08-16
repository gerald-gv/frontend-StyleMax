export interface ProductoAdmin {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string;
    precio: number;
    stock: number;
    color: string;
    fit: string;
    imagen: string;
    destacado: boolean;
    activo: boolean;

    marcaId: number;
    marca: string;

    categoriaId: number;
    categoria: string;
}

export interface CrearProductoRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    color: string;
    fit: string;
    imagen: string;
    destacado: boolean;
    marcaId: number;
    categoriaId: number;
}

export interface ActualizarProductoRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    color: string;
    fit: string;
    imagen: string;
    destacado: boolean;
    marcaId: number;
    categoriaId: number;
}