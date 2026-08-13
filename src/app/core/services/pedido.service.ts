import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Pedido } from "../models/pedido.model";

@Injectable({
    providedIn: 'root'
})
export class PedidoService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/pedidos`;

    crearPedido() {
        return this.http.post<Pedido>(`${this.apiUrl}/checkout`,{});
    }

    obtenerPedido(pedidoId: number) {
        return this.http.get<Pedido>(`${this.apiUrl}/${pedidoId}`);
    }
}