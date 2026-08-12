import { Component, inject, OnInit } from "@angular/core";
import { CarritoService } from "../../../../core/services/carrito.service";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'carrito',
    imports: [RouterLink],
    templateUrl: './carrito.html'
})
export class Carrito implements OnInit {

    readonly carritoService = inject(CarritoService);

    readonly carrito = this.carritoService.carrito;
    readonly total = this.carritoService.total;


    ngOnInit(): void {
        this.carritoService.obtenerCarrito();
    }

    aumentarCantidad(itemId: number, cantidad: number): void {
        this.carritoService.actualizarCantidad(
            itemId,
            cantidad + 1
        );
    }

    disminuirCantidad(itemId: number, cantidad: number): void {

        if (cantidad <= 1) {
            return;
        }

        this.carritoService.actualizarCantidad(
            itemId,
            cantidad - 1
        );
    }


    eliminarItem(itemId: number): void {
        this.carritoService.eliminarItem(itemId);
    }

}