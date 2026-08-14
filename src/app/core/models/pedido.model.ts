import { DetallePedido } from "./detalle-pedido.model";

export type PedidoEstado =
    | 'PENDIENTE'
    | 'PAGADO'
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