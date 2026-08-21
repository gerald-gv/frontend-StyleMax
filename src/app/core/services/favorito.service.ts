import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Favorito } from "../models/favorito.model";
import { PaginaDTO } from "../models/PaginaDTO.model";

@Injectable({
    providedIn: 'root'
})
export class FavoritoService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/favoritos`;

    listar(pagina: number = 0, tamanio: number = 8): Observable<PaginaDTO<Favorito>> {

        const params = new HttpParams()
            .set('pagina', pagina)
            .set('tamanio', tamanio);

        return this.http.get<PaginaDTO<Favorito>>(this.apiUrl, { params });
    }

    agregar(productoId: number): Observable<Favorito> {
        return this.http.post<Favorito>(
            `${this.apiUrl}/${productoId}`,
            {}
        );
    }

    eliminar(productoId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${productoId}`
        );
    }
}