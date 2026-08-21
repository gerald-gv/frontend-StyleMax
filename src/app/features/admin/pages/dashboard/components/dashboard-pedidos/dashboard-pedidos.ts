import { Component, input } from "@angular/core";
import { PedidoEstadisticas } from "../../../../models/pedido-estadisticas.model";

@Component({
    selector: 'dashboard-pedidos',
    imports: [],
    templateUrl: './dashboard-pedidos.html'
})
export class DashboardPedidos {

    readonly cargando = input(false);

    readonly pedidos = input<PedidoEstadisticas | null>(null);


    totalPedidos(): number {

        const pedidos = this.pedidos();

        if (!pedidos) {
            return 0;
        }

        return pedidos.pendientes
            + pedidos.pagados
            + pedidos.empaquetando
            + pedidos.enviando
            + pedidos.entregados
            + pedidos.cancelados;
    }


    porcentaje(valor: number, total: number): number {

        if (total <= 0) {
            return 0;
        }

        return Math.round((valor / total) * 100);
    }


    porcentajePedido(estado: number): number {

        return this.porcentaje(
            estado,
            this.totalPedidos()
        );
    }

}