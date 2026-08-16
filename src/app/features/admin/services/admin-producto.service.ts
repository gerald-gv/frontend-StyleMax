import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment.development";
import { Observable } from "rxjs";
import { ActualizarProductoRequest, CrearProductoRequest, ProductoAdmin } from "../models/producto-admin.model";

@Injectable({
    providedIn: 'root'
})
export class AdminProductoService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =`${environment.apiUrl}/admin/productos`;


    listarTodos(): Observable<ProductoAdmin[]> {
        return this.http.get<ProductoAdmin[]>(this.apiUrl);
    }


    obtenerPorId(id: number): Observable<ProductoAdmin> {
        return this.http.get<ProductoAdmin>(`${this.apiUrl}/${id}`);
    }


    crear(request: CrearProductoRequest): Observable<ProductoAdmin> {
        return this.http.post<ProductoAdmin>(this.apiUrl,request);
    }


    actualizar(id: number,request: ActualizarProductoRequest): Observable<ProductoAdmin> {
        return this.http.put<ProductoAdmin>(`${this.apiUrl}/${id}`,request);
    }


    eliminar(id: number): Observable<ProductoAdmin> {
        return this.http.delete<ProductoAdmin>(`${this.apiUrl}/${id}`);
    }
}