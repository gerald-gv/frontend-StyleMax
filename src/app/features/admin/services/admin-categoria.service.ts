import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { ActualizarCategoriaRequest, CategoriaAdmin, CategoriaEstadisticas, CrearCategoriaRequest } from "../models/categoria-admin.model";
import { PaginaDTO } from "../models/PaginaDTO.model";

@Injectable({
    providedIn: 'root'
})
export class AdminCategoriaService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/admin/categorias`;


    listar(pagina: number,q?: string): Observable<PaginaDTO<CategoriaAdmin>> {

        let params = new HttpParams().set('page', pagina);

        if (q?.trim()) {
            params = params.set('q', q.trim());
        }

        return this.http.get<PaginaDTO<CategoriaAdmin>>(this.apiUrl,{ params });
    }


    obtenerEstadisticas(): Observable<CategoriaEstadisticas> {
        return this.http.get<CategoriaEstadisticas>(`${this.apiUrl}/estadisticas`);
    }


    crear(request: CrearCategoriaRequest): Observable<CategoriaAdmin> {
        return this.http.post<CategoriaAdmin>(this.apiUrl,request);
    }


    actualizar(id: number,request: ActualizarCategoriaRequest): Observable<CategoriaAdmin> {
        return this.http.put<CategoriaAdmin>(`${this.apiUrl}/${id}`,request);
    }


    eliminar(id: number): Observable<CategoriaAdmin> {
        return this.http.delete<CategoriaAdmin>(`${this.apiUrl}/${id}`);
    }

}