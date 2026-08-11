import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/marcas`;

  listar(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }
}