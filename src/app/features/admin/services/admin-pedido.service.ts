import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { ActualizarPedidoEstadoRequest, PedidoAdmin, PedidoEstado } from "../models/pedido-admin.model";
import { Observable } from "rxjs";
import { PaginaDTO } from "../models/PaginaDTO.model";
import { PedidoEstadisticas } from "../models/pedido-estadisticas.model";
import { PedidoAdminDetalle } from "../models/pedido-admin-detalle.model";

@Injectable({
    providedIn: 'root'
})
export class AdminPedidoService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/admin/pedidos`;


    // LISTAR PEDIDOS

    listar(pagina: number,estado?: PedidoEstado | string,q?: string): Observable<PaginaDTO<PedidoAdmin>> {

        let params = new HttpParams().set('pagina', pagina);


        if (estado?.trim()) {

            params = params.set('estado',
            estado.trim());

        }


        if (q?.trim()) {

            params = params.set('q',q.trim());

        }


        return this.http.get<PaginaDTO<PedidoAdmin>>(this.apiUrl,{ params });

    }


    // ESTADISTICAS

    obtenerEstadisticas(): Observable<PedidoEstadisticas> {

        return this.http.get<PedidoEstadisticas>(`${this.apiUrl}/estadisticas`);

    }


    // DETALLE

    obtener(id: number): Observable<PedidoAdminDetalle> {

        return this.http.get<PedidoAdminDetalle>(`${this.apiUrl}/${id}`);

    }


    // ACTUALIZAR ESTADO

    actualizarEstado(id: number,request: ActualizarPedidoEstadoRequest): Observable<PedidoAdminDetalle> {

        return this.http.patch<PedidoAdminDetalle>(`${this.apiUrl}/${id}/estado`,request);

    }
    

}