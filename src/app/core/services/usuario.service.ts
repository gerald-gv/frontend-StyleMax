import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Usuario } from "../models/usuario.model";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/usuarios`;

    actualizar(datos: {
        nombre: string;
        apellido: string;
        telefono: string;
    }) {
        return this.http.put<Usuario>(this.apiUrl, datos);
    }
}