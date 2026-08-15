import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Carrito } from "../models/carrito.model";
import { concatMap, from, last, Observable, of, tap } from "rxjs";

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

    // Mapea las cantidades modificadas
    private readonly pendingUpdates = new Map<number, number>();

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

    // Actualiza el carrito localmente
    actualizarCantidadLocal(itemId: number,cantidad: number): void {

        this._carrito.update(carrito => {

            if (!carrito) {
                return carrito;
            }

            const items = carrito.items.map(item => {

                if (item.id !== itemId) {
                    return item;
                }

                const subtotal = Number((item.precioUnitario * cantidad).toFixed(2));

                return {
                    ...item,
                    cantidad,
                    subtotal
                };
            });


            const total = Number(items.reduce((total, item) => total + item.subtotal,0).toFixed(2)
            );


            return {
                ...carrito,
                items,
                total
            };

        });


        this.pendingUpdates.set(itemId, cantidad);
    }

    // Se envia al backend los cambios locales del carrito
    sincronizarCambios(): Observable<Carrito> {

        if (this.pendingUpdates.size === 0) {
            const carrito = this._carrito();
            return carrito ? of(carrito) : of(null as unknown as Carrito);
        }


        const cambios = Array.from(
            this.pendingUpdates.entries()
        );


        return from(cambios).pipe(

            concatMap(([itemId, cantidad]) =>
                this.http.put<Carrito>(`${this.apiUrl}/items/${itemId}`, { cantidad })
            ),

            last(),

            tap(carrito => {
                this._carrito.set(carrito);
                this.pendingUpdates.clear();
            })

        );
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