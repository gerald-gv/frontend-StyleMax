import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PedidoService } from '../../../../core/services/pedido.service';
import { Pedido } from '../../../../core/models/pedido.model';

@Component({
  selector: 'checkout-success',
  imports: [RouterLink],
  templateUrl: './checkout-success.html',
})
export class CheckoutSuccess implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pedidoService = inject(PedidoService);

  readonly pedido = signal<Pedido | null>(null);
  readonly cargando = signal(true);
  readonly confirmando = signal(false);
  readonly error = signal(false);

  private intervalo: ReturnType<typeof setInterval> | null = null;
  private intentos = 0;

  private readonly MAX_INTENTOS = 10;
  private readonly INTERVALO_MS = 3000;


  ngOnInit(): void {

    const pedidoId = this.obtenerPedidoId();

    if (!pedidoId) {
      this.cargando.set(false);
      this.error.set(true);
      return;
    }

    this.consultarPedido(pedidoId);
  }


  private obtenerPedidoId(): number | null {

    const externalReference = this.route.snapshot.queryParamMap.get('external_reference');

    if (!externalReference) {
      return null;
    }

    const pedidoId = Number(externalReference);

    return Number.isInteger(pedidoId) && pedidoId > 0 ? pedidoId : null;

  }


  private consultarPedido(pedidoId: number): void {

    this.pedidoService.obtenerPedido(pedidoId).subscribe({

      next: (pedido) => {
        this.pedido.set(pedido);
        this.cargando.set(false);

        if (pedido.estado === 'PAGADO') {
          this.detenerPolling();
          return;
        }

        if (pedido.estado === 'PENDIENTE') {
          this.iniciarPolling(pedidoId);
          return;
        }

        this.detenerPolling();
      },

      error: () => {
        this.cargando.set(false);
        this.error.set(true);
        this.detenerPolling();
      }
    });
  }


  private iniciarPolling(pedidoId: number): void {

    if (this.intervalo || this.intentos >= this.MAX_INTENTOS) {
      return;
    }

    this.confirmando.set(true);

    this.intervalo = setInterval(() => {

      this.intentos++;

      this.pedidoService.obtenerPedido(pedidoId).subscribe({

        next: (pedido) => {

          this.pedido.set(pedido);

          if (pedido.estado === 'PAGADO') {
            this.confirmando.set(false);
            this.detenerPolling();
          }

          if (pedido.estado === 'CANCELADO' || this.intentos >= this.MAX_INTENTOS) {
            this.confirmando.set(false);
            this.detenerPolling();
          }

        },

        error: () => {

          if (this.intentos >= this.MAX_INTENTOS) {

            this.confirmando.set(false);
            this.error.set(true);
            this.detenerPolling();

          }

        }

      });

    }, this.INTERVALO_MS);
  }


  private detenerPolling(): void {

    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }

  }

}
