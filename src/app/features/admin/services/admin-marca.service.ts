import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { PaginaDTO } from "../../../core/models/PaginaDTO.model";
import { ActualizarMarcaRequest, CrearMarcaRequest, MarcaAdmin } from "../models/marca-admin.model";
import { MarcaEstadisticas } from "../models/marca-estadisticas.model";

@Injectable({
    providedIn: 'root'
})
export class AdminMarcaService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/admin/marcas`;


    listar(
        pagina: number,
        q?: string
    ): Observable<PaginaDTO<MarcaAdmin>> {

        let params = new HttpParams()
            .set('page', pagina);

        if (q?.trim()) {
            params = params.set('q', q.trim());
        }

        return this.http.get<PaginaDTO<MarcaAdmin>>(
            this.apiUrl,
            { params }
        );
    }


    obtenerEstadisticas(): Observable<MarcaEstadisticas> {

        return this.http.get<MarcaEstadisticas>(
            `${this.apiUrl}/estadisticas`
        );
    }


    crear(
        request: CrearMarcaRequest
    ): Observable<MarcaAdmin> {

        return this.http.post<MarcaAdmin>(
            this.apiUrl,
            request
        );
    }


    actualizar(
        id: number,
        request: ActualizarMarcaRequest
    ): Observable<MarcaAdmin> {

        return this.http.put<MarcaAdmin>(
            `${this.apiUrl}/${id}`,
            request
        );
    }


    eliminar(
        id: number
    ): Observable<MarcaAdmin> {

        return this.http.delete<MarcaAdmin>(
            `${this.apiUrl}/${id}`
        );
    }
}