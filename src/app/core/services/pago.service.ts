import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { PagoResponse } from "../models/pago.model";

@Injectable({
    providedIn: 'root'
})
export class PagoService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/pagos`;

    crearPago(pedidoId: number) {
        return this.http.post<PagoResponse>(`${this.apiUrl}/pedido/${pedidoId}`,{});
    }
}