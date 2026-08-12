import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Carrito } from "../models/carrito.model";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CarritoService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/carrito`;

    private readonly _carrito = signal<Carrito | null>(null);

    readonly carrito = this._carrito.asReadonly();

    readonly cantidadItems = computed(() =>
        this._carrito()?.items.reduce(
            (total, item) => total + item.cantidad,
            0
        ) ?? 0
    );


    readonly total = computed(() =>
        this._carrito()?.total ?? 0
    );


    obtenerCarrito(): void {
        this.http.get<Carrito>(this.apiUrl).subscribe({

            next: (carrito) => {
                this._carrito.set(carrito);
            },
            error: () => {
                console.error('Error al obtener el carrito');
            }

        });
    }

    agregarItem(productoId: number, cantidad: number): Observable<Carrito> {
        return this.http.post<Carrito>(`${this.apiUrl}/items`,
            {
                productoId,
                cantidad
            }
        ).pipe(
            tap(carrito => this._carrito.set(carrito))
        );
    }

    actualizarCantidad(itemId: number, cantidad: number): void {
        this.http.put<Carrito>(`${this.apiUrl}/items/${itemId}`,{cantidad}).subscribe({
            next: (carrito) => {
                this._carrito.set(carrito);
            }
        });
    }

    eliminarItem(itemId: number): void {
        this.http.delete<Carrito>(`${this.apiUrl}/items/${itemId}`).subscribe({
            next: (carrito) => {
                this._carrito.set(carrito);
            }
        });
    }

    limpiarCarrito(): void {
        this._carrito.set(null);
    }

}