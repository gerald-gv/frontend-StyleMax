import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { environment } from '../../../environments/environment';
import { ProductoDetalle } from '../models/producto-detalle.model';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/productos`;

  listarCatalogo(categoriaId?: number, marcaId?: number, q?: string): Observable<Producto[]> {

    let params = new HttpParams();

    if (categoriaId !== undefined) {
      params = params.set('categoriaId', categoriaId);
    }

    if (marcaId !== undefined) {
      params = params.set('marcaId', marcaId);
    }

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<Producto[]>(this.apiUrl, { params });
  }

  obtenerPorSlug(slug: string): Observable<ProductoDetalle> {
    return this.http.get<ProductoDetalle>(`${this.apiUrl}/${slug}`);
  }
}