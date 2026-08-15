import { Component, inject, OnInit, signal } from "@angular/core";
import { CarritoService } from "../../../../core/services/carrito.service";
import { Router, RouterLink } from "@angular/router";

@Component({
    selector: 'carrito',
    imports: [RouterLink],
    templateUrl: './carrito.html'
})
export class Carrito implements OnInit {

    readonly carritoService = inject(CarritoService);
    private readonly router = inject(Router);

    readonly carrito = this.carritoService.carrito;
    readonly total = this.carritoService.total;

    readonly sincronizando = signal(false);

    readonly errorStock = signal<string | null>(null);

    ngOnInit(): void {
        this.carritoService.obtenerCarrito();
    }

    aumentarCantidad(itemId: number, cantidad: number): void {
        this.carritoService.actualizarCantidadLocal(
            itemId,
            cantidad + 1
        );
    }

    disminuirCantidad(itemId: number, cantidad: number): void {

        if (cantidad <= 1) {
            return;
        }

        this.carritoService.actualizarCantidadLocal(
            itemId,
            cantidad - 1
        );
    }


    eliminarItem(itemId: number): void {
        this.carritoService.eliminarItem(itemId);
    }

    continuarCompra(): void {
        this.errorStock.set(null);
        this.sincronizando.set(true);

        this.carritoService.sincronizarCambios().subscribe({

            next: () => {
                this.sincronizando.set(false);
                this.router.navigate(['/checkout']);
            },


            error: (error) => {

                this.sincronizando.set(false);
                this.errorStock.set(error.error?.message ??
                    'No se pudo actualizar el carrito.'
                );

            }

        });
    }

}