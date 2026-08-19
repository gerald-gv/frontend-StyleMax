import { Component, effect, inject, input, output, signal } from '@angular/core';
import { PedidoEstado } from '../../../../models/pedido-admin.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AdminPedidoService } from '../../../../services/admin-pedido.service';
import { PedidoAdminDetalle } from '../../../../models/pedido-admin-detalle.model';

@Component({
  selector: 'modal-pedido',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './modal-pedido.html',
})
export class ModalPedido {

  private readonly pedidoService = inject(AdminPedidoService);

  // INPUT
  readonly pedidoId = input<number | null>(null);


  // OUTPUT
  readonly cerrar = output<void>();


  // DATA
  readonly pedido = signal<PedidoAdminDetalle | null>(null);

  // ESTADO
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);


  constructor() {

    effect(() => {

      const id = this.pedidoId();

      if (id === null) {
        this.pedido.set(null);
        return;
      }

      this.cargarDetalle(id);

    });

  }


  private cargarDetalle(id: number): void {

    this.cargando.set(true);
    this.error.set(null);
    this.pedido.set(null);


    this.pedidoService.obtener(id).subscribe({

      next: detalle => {

        this.pedido.set(detalle);
        this.cargando.set(false);

      },

      error: () => {

        this.error.set('No se pudo cargar el detalle del pedido.');
        this.cargando.set(false);

      }

    });

  }


  cerrarModal(): void {
    this.cerrar.emit();
  }


  protected estadoLabel(estado: PedidoEstado): string {

    switch (estado) {

      case 'PENDIENTE':
        return 'Pendiente';

      case 'PAGADO':
        return 'Pagado';

      case 'EMPAQUETANDO':
        return 'Empaquetando';

      case 'ENVIANDO':
        return 'Enviando';

      case 'ENTREGADO':
        return 'Entregado';

      case 'CANCELADO':
        return 'Cancelado';

    }

  }


  protected estadoIcono(estado: PedidoEstado): string {

    switch (estado) {

      case 'PENDIENTE':
        return 'fa-clock';

      case 'PAGADO':
        return 'fa-credit-card';

      case 'EMPAQUETANDO':
        return 'fa-box-open';

      case 'ENVIANDO':
        return 'fa-truck';

      case 'ENTREGADO':
        return 'fa-circle-check';

      case 'CANCELADO':
        return 'fa-circle-xmark';

    }

  }

}