import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Pedido, PedidoClienteResumen, PedidoDetalleCliente, PedidoEstado } from "../models/pedido.model";
import { PaginaDTO } from "../models/PaginaDTO.model";

@Injectable({
    providedIn: 'root'
})
export class PedidoService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/pedidos`;

    crearPedido() {
        return this.http.post<Pedido>(`${this.apiUrl}/checkout`, {});
    }

    obtenerPedido(pedidoId: number) {
        return this.http.get<Pedido>(`${this.apiUrl}/${pedidoId}`);
    }

    // MIS PEDIDOS

    obtenerMisPedidos(
        pagina: number = 0,
        tamanio: number = 10,
        estados?: PedidoEstado[]
    ) {

        let params = new HttpParams()
            .set('pagina', pagina)
            .set('tamanio', tamanio);

        if (estados && estados.length > 0) {

            params = params.set(
                'estados',
                estados.join(',')
            );

        }

        return this.http.get<
            PaginaDTO<PedidoClienteResumen>
        >(
            `${this.apiUrl}/mis-pedidos`,
            { params }
        );

    }


    // =========================
    // DETALLE PARA EL MODAL
    // =========================

    obtenerDetallePedidoCliente(
        pedidoId: number
    ) {

        return this.http.get<PedidoDetalleCliente>(
            `${this.apiUrl}/mis-pedidos/${pedidoId}`
        );

    }
}