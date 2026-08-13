import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PedidoService } from '../../../../core/services/pedido.service';
import { Pedido } from '../../../../core/models/pedido.model';

@Component({
  selector: 'checkout-pending',
  imports: [RouterLink],
  templateUrl: './checkout-pending.html',
})
export class CheckoutPending implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly pedidoService = inject(PedidoService);

  readonly pedido = signal<Pedido | null>(null);
  readonly cargando = signal(true);

  ngOnInit(): void {

    const externalReference = this.route.snapshot.queryParamMap.get('external_reference');

    const pedidoId = Number(externalReference);

    if (!externalReference || !Number.isInteger(pedidoId)) {
      this.cargando.set(false);
      return;
    }

    this.pedidoService.obtenerPedido(pedidoId).subscribe({

      next: (pedido) => {
        this.pedido.set(pedido);
        this.cargando.set(false);
      },

      error: () => {
        this.cargando.set(false);
      }

    });
  }
}
