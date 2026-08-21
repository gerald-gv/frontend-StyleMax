import { Component, input, output } from '@angular/core';

@Component({
  selector: 'confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.html',
})
export class ConfirmationModal {

    readonly abierto = input(false);

    readonly titulo = input('¿Estás seguro?');

    readonly mensaje = input(
        'Esta acción requiere confirmación.'
    );

    readonly textoConfirmar = input('Confirmar');

    readonly textoCancelar = input('Cancelar');


    readonly confirmar = output<void>();

    readonly cancelar = output<void>();

}
