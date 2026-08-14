import { Component, inject, signal } from '@angular/core';
import { CarritoService } from '../../../../core/services/carrito.service';
import { PedidoService } from '../../../../core/services/pedido.service';
import { PagoService } from '../../../../core/services/pago.service';
import { RouterLink } from '@angular/router';
import { DireccionService } from '../../../../core/services/direccion.service';
import { Direccion } from '../../../../core/models/direccion.model';

@Component({
  selector: 'checkout',
  imports: [RouterLink],
  templateUrl: './checkout.html',
})
export class Checkout {

    private readonly carritoService = inject(CarritoService);
    private readonly pedidoService = inject(PedidoService);
    private readonly pagoService = inject(PagoService);
    private readonly direccionService = inject(DireccionService);


    readonly carrito = this.carritoService.carrito;

    readonly procesando = signal(false);

    readonly cargandoDireccion = signal(false);

    readonly mostrarModalDireccion = signal(false);

    readonly direccion = signal<Direccion | null>(null);

    readonly sinDireccion = signal(false);

    readonly error = signal(false);

    iniciarPago(): void {

        if (this.procesando() || this.cargandoDireccion()) {
            return;
        }


        this.error.set(false);
        this.sinDireccion.set(false);
        this.direccion.set(null);

        this.cargandoDireccion.set(true);


        this.direccionService.obtenerDireccion().subscribe({

            next: (direccion) => {

                this.direccion.set(direccion);
                this.cargandoDireccion.set(false);
                this.mostrarModalDireccion.set(true);
            },


            error: (error) => {

                this.cargandoDireccion.set(false);


                // El usuario no tiene dirección registrada
                if (error.status === 404) {
                    this.sinDireccion.set(true);
                    this.mostrarModalDireccion.set(true);
                    return;
                }

                this.error.set(true);
            }
        });
    }

    confirmarDireccion(): void {

        if (this.procesando() || this.cargandoDireccion() || !this.direccion()
        ) {
            return;
        }


        this.mostrarModalDireccion.set(false);

        this.procesando.set(true);
        this.error.set(false);

        this.pedidoService.crearPedido().subscribe({
            next: (pedido) => {

                this.pagoService.crearPago(pedido.id).subscribe({
                    next: (pago) => {
                        window.location.href = pago.initPoint;
                    },


                    error: () => {
                        this.procesando.set(false);
                        this.error.set(true);
                    }

                });
            },


            error: (error) => {

                this.procesando.set(false);

                if (error.status === 400) {
                    this.sinDireccion.set(true);
                    this.mostrarModalDireccion.set(true);
                    return;
                }

                this.error.set(true);
            }

        });
    }

    cerrarModalDireccion(): void {
        if (this.procesando()) {
            return;
        }
        this.mostrarModalDireccion.set(false);
    }
}