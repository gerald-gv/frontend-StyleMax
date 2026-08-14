import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { ActualizarPerfilRequest, Perfil } from "../models/perfil.model";

@Injectable({
    providedIn: 'root'
})
export class PerfilService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/perfil`;

    obtenerPerfil() {
        return this.http.get<Perfil>(this.apiUrl);
    }

    actualizarPerfil(request: ActualizarPerfilRequest) {
        return this.http.put<Perfil>(this.apiUrl, request);
    }
}