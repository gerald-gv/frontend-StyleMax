import { DetallePedido } from "./detalle-pedido.model";

export type PedidoEstado =
    | 'PENDIENTE'
    | 'PAGADO'
    | 'EMPAQUETANDO'
    | 'ENVIANDO'
    | 'ENTREGADO'
    | 'CANCELADO';

export interface Pedido {
    id: number;
    fechaPedido: string;
    total: number;
    estado: PedidoEstado;
    departamento: string;
    provincia: string;
    distrito: string;
    direccionCompleta: string;
    referencia: string | null;
    detalles: DetallePedido[];
}

export interface PedidoClienteResumen {

    id: number;
    fechaPedido: string;
    estado: PedidoEstado;
    total: number;
    cantidadProductos: number;
    primerProducto: string | null;
    primeraImagen: string | null;

}


// MIS PEDIDOS - DETALLE

export interface PedidoDetalleCliente {

    id: number;
    fechaPedido: string;
    estado: PedidoEstado;
    total: number;
    productos: PedidoProducto[];
    departamento: string;
    provincia: string;
    distrito: string;
    direccionCompleta: string;
    referencia: string | null;
    metodoPago: string;

}


// PRODUCTO DEL PEDIDO

export interface PedidoProducto {

    productoId: number;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    imagen: string | null;
    subtotal: number;

}