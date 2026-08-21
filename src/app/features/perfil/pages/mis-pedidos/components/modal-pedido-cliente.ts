import { Component, inject } from "@angular/core";
import { Pedidos } from "../mis-pedidos";
import { PedidoDetalleCliente, PedidoEstado } from "../../../../../core/models/pedido.model";
import { DatePipe, DecimalPipe } from "@angular/common";
import { SkeletonModalPedido } from "../../../../../shared/components/skeleton-modal-pedido/skeleton-modal-pedido";

@Component({
  selector: 'modal-pedido-cliente',
  imports: [DecimalPipe, DatePipe, SkeletonModalPedido],
  templateUrl: './modal-pedido-cliente.html',
})
export class ModalPedidoCliente {

  private readonly pedidos = inject(Pedidos);

  protected readonly pedido = this.pedidos.pedidoSeleccionado;
  protected readonly cargando = this.pedidos.cargandoDetalle;
  protected readonly error = this.pedidos.errorDetalle;


  // CERRAR

  protected cerrar(): void {
    this.pedidos.cerrarModal();
  }


  // ESTADO

  protected estadoLabel(estado: PedidoEstado): string {

    switch (estado) {

      case 'PENDIENTE':
        return 'Pendiente';

      case 'PAGADO':
        return 'Pagado';

      case 'EMPAQUETANDO':
        return 'Preparando';

      case 'ENVIANDO':
        return 'En camino';

      case 'ENTREGADO':
        return 'Entregado';

      case 'CANCELADO':
        return 'Cancelado';

      default:
        return estado;

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

      default:
        return 'fa-circle-question';

    }

  }


  // PROGRESO

  protected progresoEstado(estado: PedidoEstado): number {

    switch (estado) {

      case 'PENDIENTE':
        return 0;

      case 'PAGADO':
        return 1;

      case 'EMPAQUETANDO':
        return 2;

      case 'ENVIANDO':
        return 3;

      case 'ENTREGADO':
        return 4;

      case 'CANCELADO':
        return 0;

      default:
        return 0;

    }

  }


  protected pasoCompletado(estado: PedidoEstado, paso: number): boolean {
    return this.progresoEstado(estado) >= paso;
  }


  protected pasoActual(estado: PedidoEstado, paso: number): boolean {
    return this.progresoEstado(estado) === paso;
  }


  protected esCancelado(estado: PedidoEstado): boolean {
    return estado === 'CANCELADO';
  }


  // CANTIDAD DE PRODUCTOS

  protected cantidadTotalProductos(pedido: PedidoDetalleCliente): number {

    return pedido.productos.reduce( (total, producto) => total + producto.cantidad, 0 );

  }

}