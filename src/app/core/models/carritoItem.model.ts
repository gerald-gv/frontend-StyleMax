export interface CarritoItem {
    id: number;
    productoId: number;
    productoNombre: string;
    productoImagen: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface AgregarItemCarritoRequest {
    productoId: number;
    cantidad: number;
}

export interface ActualizarCantidadRequest {
    cantidad: number;
}