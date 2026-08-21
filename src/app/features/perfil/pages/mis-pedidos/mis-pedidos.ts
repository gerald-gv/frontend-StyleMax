import { DatePipe, DecimalPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ModalPedidoCliente } from "./components/modal-pedido-cliente";
import { PedidoService } from "../../../../core/services/pedido.service";
import { PedidoClienteResumen, PedidoDetalleCliente, PedidoEstado } from "../../../../core/models/pedido.model";

type FiltroPedido =
  | 'TODOS'
  | 'EN_CURSO'
  | 'ENTREGADOS'
  | 'CANCELADOS';


@Component({
  selector: 'mis-pedidos',
  imports: [DatePipe, DecimalPipe, RouterLink, ModalPedidoCliente],
  templateUrl: './mis-pedidos.html',
})
export class Pedidos implements OnInit {

  private readonly pedidoService = inject(PedidoService);

  // PEDIDOS

  readonly pedidos = signal<PedidoClienteResumen[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);


  // FILTRO

  readonly filtroActual = signal<FiltroPedido>('TODOS');


  // PAGINACION

  readonly paginaActual = signal(0);
  readonly tamanioPagina = 10;
  readonly totalElementos = signal(0);
  readonly totalPaginas = signal(0);
  readonly ultimaPagina = signal(true);


  // MODAL

  readonly modalAbierto = signal(false);

  readonly pedidoSeleccionado =
    signal<PedidoDetalleCliente | null>(null);

  readonly cargandoDetalle = signal(false);

  readonly errorDetalle =
    signal<string | null>(null);


  // INIT

  ngOnInit(): void {
    this.cargarPedidos();
  }


  // CARGAR PEDIDOS

  private cargarPedidos(): void {
    this.cargando.set(true);
    this.error.set(null);


    const estados = this.obtenerEstadosFiltro();


    this.pedidoService
      .obtenerMisPedidos(this.paginaActual(), this.tamanioPagina, estados)
      .subscribe({

        next: (pagina) => {

          this.pedidos.set(pagina.contenido);
          this.paginaActual.set(pagina.pagina);
          this.totalElementos.set(pagina.totalElementos);
          this.totalPaginas.set(pagina.totalPaginas);
          this.ultimaPagina.set(pagina.ultima);

          this.cargando.set(false);

        },

        error: () => {

          this.error.set('No se pudieron cargar tus pedidos.');
          this.cargando.set(false);

        }

      });

  }


  // ESTADOS DEL FILTRO

  private obtenerEstadosFiltro(): PedidoEstado[] | undefined {

    switch (this.filtroActual()) {

      case 'TODOS':
        return undefined;

      case 'EN_CURSO':
        return [
          'PENDIENTE',
          'PAGADO',
          'EMPAQUETANDO',
          'ENVIANDO'
        ];

      case 'ENTREGADOS':
        return [
          'ENTREGADO'
        ];

      case 'CANCELADOS':
        return [
          'CANCELADO'
        ];

    }

  }


  // CAMBIAR FILTRO

  protected cambiarFiltro(filtro: FiltroPedido): void {

    if (this.filtroActual() === filtro) {
      return;
    }

    this.filtroActual.set(filtro);

    this.paginaActual.set(0);

    this.cargarPedidos();

  }


  // PAGINA ANTERIOR

  protected paginaAnterior(): void {

    if (this.paginaActual() <= 0) {
      return;
    }

    this.paginaActual.update(pagina => pagina - 1);

    this.cargarPedidos();

  }


  // PAGINA SIGUIENTE

  protected paginaSiguiente(): void {

    if (this.ultimaPagina()) {
      return;
    }

    this.paginaActual.update(pagina => pagina + 1);

    this.cargarPedidos();

  }


  // ABRIR MODAL

  protected abrirModal(pedidoId: number): void {

    this.modalAbierto.set(true);
    this.pedidoSeleccionado.set(null);
    this.cargandoDetalle.set(true);
    this.errorDetalle.set(null);


    this.pedidoService
      .obtenerDetallePedidoCliente(pedidoId)
      .subscribe({

        next: (pedido) => {

          this.pedidoSeleccionado.set(pedido);
          this.cargandoDetalle.set(false);

        },

        error: () => {

          this.errorDetalle.set( 'No se pudo cargar el detalle del pedido.' );
          this.cargandoDetalle.set(false);

        }

      });

  }


  // CERRAR MODAL

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.pedidoSeleccionado.set(null);
    this.errorDetalle.set(null);

  }


  // ESTADO

  protected estadoLabel( estado: PedidoEstado ): string {

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

      default:
        return estado;

    }

  }


  protected estadoIcono( estado: PedidoEstado ): string {

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

}