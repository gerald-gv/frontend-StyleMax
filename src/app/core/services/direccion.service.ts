import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { ActualizarDireccionRequest, Direccion } from "../models/direccion.model";

@Injectable({
    providedIn: 'root'
})
export class DireccionService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/direccion`;

    obtenerDireccion() {
        return this.http.get<Direccion>(this.apiUrl);
    }

    guardarDireccion(request: ActualizarDireccionRequest) {
        return this.http.put<Direccion>(this.apiUrl,request);
    }
}