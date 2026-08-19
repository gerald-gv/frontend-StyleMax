import { PedidoEstado } from './pedido-admin.model';


export interface PedidoAdminDetalle {
    id: number;
    fechaPedido: string;
    total: number;
    estado: PedidoEstado;
    cliente: ClientePedidoAdmin;
    direccion: DireccionPedidoAdmin;
    detalles: DetallePedidoAdmin[];
    pago: PagoPedidoAdmin;
}


export interface ClientePedidoAdmin {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
}


export interface DireccionPedidoAdmin {
    departamento: string;
    provincia: string;
    distrito: string;
    direccionCompleta: string;
    referencia: string | null;
}


export interface DetallePedidoAdmin {
    productoId: number;
    productoNombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}


export interface PagoPedidoAdmin {
    metodo: string;
    preferenceId: string | null;
    paymentId: string | null;
}
