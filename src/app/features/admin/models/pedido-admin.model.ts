export interface PedidoAdmin {
    id: number;
    cliente: string;
    correo: string;
    fechaPedido: string;
    total: number;
    estado: PedidoEstado;
}


export type PedidoEstado =
    | 'PENDIENTE'
    | 'PAGADO'
    | 'EMPAQUETANDO'
    | 'ENVIANDO'
    | 'ENTREGADO'
    | 'CANCELADO';


export interface ActualizarPedidoEstadoRequest {
    estado: PedidoEstado;
}
