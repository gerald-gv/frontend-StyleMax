import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductoDetalle } from '../models/producto-detalle.model';
import { CatalogoResponse } from '../models/catalogo-response.model';
import { Producto } from '../models/producto.model';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/productos`;

  listarCatalogo(pagina: number, categoriaId?: number, marcaId?: number, fit?: string, q?: string, size?: number): Observable<CatalogoResponse> {

    let params = new HttpParams().set('page', pagina);

    if (size !== undefined) {
      params = params.set('size', size);
    }

    if (categoriaId !== undefined) {
      params = params.set('categoriaId', categoriaId);
    }

    if (marcaId !== undefined) {
      params = params.set('marcaId', marcaId);
    }

    if (fit) {
      params = params.set('fit', fit);
    }

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<CatalogoResponse>(this.apiUrl, { params });
  }

  obtenerPorSlug(slug: string): Observable<ProductoDetalle> {
    return this.http.get<ProductoDetalle>(`${this.apiUrl}/${slug}`);
  }

  listarDestacados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/destacados`);
  }
}