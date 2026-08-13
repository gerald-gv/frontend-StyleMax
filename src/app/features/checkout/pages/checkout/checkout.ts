import { Component, inject, signal } from '@angular/core';
import { CarritoService } from '../../../../core/services/carrito.service';
import { PedidoService } from '../../../../core/services/pedido.service';
import { PagoService } from '../../../../core/services/pago.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'checkout',
  imports: [RouterLink],
  templateUrl: './checkout.html',
})
export class Checkout {


  private readonly carritoService = inject(CarritoService);
  private readonly pedidoService = inject(PedidoService);
  private readonly pagoService = inject(PagoService);

  readonly carrito = this.carritoService.carrito;

  readonly procesando = signal(false);
  readonly error = signal(false);


  iniciarPago(): void {

    if (this.procesando()) {
      return;
    }

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

      error: () => {
        this.procesando.set(false);
        this.error.set(true);
      }

    });
  }


}
