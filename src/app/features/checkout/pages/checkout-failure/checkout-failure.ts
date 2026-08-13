import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PagoService } from '../../../../core/services/pago.service';

@Component({
  selector: 'app-checkout-failure',
  imports: [RouterLink],
  templateUrl: './checkout-failure.html',
})
export class CheckoutFailure implements OnInit {

    private readonly route = inject(ActivatedRoute);
    private readonly pagoService = inject(PagoService);

    readonly pedidoId = signal<number | null>(null);
    readonly procesando = signal(false);
    readonly error = signal(false);


    ngOnInit(): void {

        const externalReference =
            this.route.snapshot.queryParamMap.get('external_reference');

        const id = Number(externalReference);

        if (
            externalReference &&
            Number.isInteger(id) &&
            id > 0
        ) {
            this.pedidoId.set(id);
        }
    }


    reintentarPago(): void {

        const id = this.pedidoId();

        if (!id || this.procesando()) {
            return;
        }

        this.procesando.set(true);
        this.error.set(false);

        this.pagoService.crearPago(id).subscribe({

            next: (pago) => {

                window.location.href = pago.initPoint;

            },

            error: () => {

                this.procesando.set(false);
                this.error.set(true);

            }

        });
    }
}
