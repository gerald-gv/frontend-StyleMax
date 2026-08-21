import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { PaginaDTO } from "../../../core/models/PaginaDTO.model";
import { ActualizarUsuarioRequest, RestablecerPasswordRequest, UsuarioAdmin } from "../models/usuario-admin.model";
import { UsuarioEstadisticas } from "../models/usuario-estadisticas.model";

@Injectable({
    providedIn: 'root'
})
export class AdminUsuarioService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/admin/usuarios`;


    listar(pagina: number,rol?: string,q?: string): Observable<PaginaDTO<UsuarioAdmin>> {

        let params = new HttpParams().set('pagina', pagina);

        if (rol?.trim()) {
            params = params.set('rol',rol.trim());
        }

        if (q?.trim()) {
            params = params.set('q',q.trim());
        }

        return this.http.get<PaginaDTO<UsuarioAdmin>>(this.apiUrl,{ params });

    }


    obtenerEstadisticas(): Observable<UsuarioEstadisticas> {
        return this.http.get<UsuarioEstadisticas>(`${this.apiUrl}/estadisticas`);
    }


    obtener(id: number): Observable<UsuarioAdmin> {
        return this.http.get<UsuarioAdmin>(`${this.apiUrl}/${id}`);
    }


    actualizar(id: number,request: ActualizarUsuarioRequest): Observable<UsuarioAdmin> {
        return this.http.put<UsuarioAdmin>(`${this.apiUrl}/${id}`,request);
    }


    restablecerPassword(id: number,request: RestablecerPasswordRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/password`,request);
    }

    activar(id: number ): Observable<UsuarioAdmin> {
        return this.http.put<UsuarioAdmin>(`${this.apiUrl}/${id}/activar`,{});
    }


    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}