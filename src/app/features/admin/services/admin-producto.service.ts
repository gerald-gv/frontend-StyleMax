import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { ActualizarProductoRequest, CrearProductoRequest, ProductoAdmin } from "../models/producto-admin.model";
import { PaginaDTO } from "../../../core/models/PaginaDTO.model";
import { ProductoEstadisticas } from "../models/producto-estadisticas.model";

@Injectable({
    providedIn: 'root'
})
export class AdminProductoService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =`${environment.apiUrl}/admin/productos`;


    listar(pagina: number, q?: string): Observable<PaginaDTO<ProductoAdmin>> {

        let params = new HttpParams().set('page', pagina);

        if (q?.trim()) {
            params = params.set('q', q.trim());
        }

        return this.http.get<PaginaDTO<ProductoAdmin>>(this.apiUrl, { params });
    }

    obtenerEstadisticas(): Observable<ProductoEstadisticas> {
        return this.http.get<ProductoEstadisticas>(`${this.apiUrl}/estadisticas`);
    }


    obtenerPorId(id: number): Observable<ProductoAdmin> {
        return this.http.get<ProductoAdmin>(`${this.apiUrl}/${id}`);
    }


    crear(request: CrearProductoRequest): Observable<ProductoAdmin> {
        return this.http.post<ProductoAdmin>(this.apiUrl, request);
    }


    actualizar(id: number, request: ActualizarProductoRequest): Observable<ProductoAdmin> {
        return this.http.put<ProductoAdmin>(`${this.apiUrl}/${id}`, request);
    }


    eliminar(id: number): Observable<ProductoAdmin> {
        return this.http.delete<ProductoAdmin>(`${this.apiUrl}/${id}`);
    }
}