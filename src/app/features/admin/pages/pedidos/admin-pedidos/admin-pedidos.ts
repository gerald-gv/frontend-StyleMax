import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AdminPedidoService } from '../../../services/admin-pedido.service';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap } from 'rxjs';
import { PedidoAdmin, PedidoEstado } from '../../../models/pedido-admin.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ModalPedido } from '../components/modal-pedido/modal-pedido';

@Component({
  selector: 'app-admin-pedidos',
  imports: [DatePipe, DecimalPipe, ModalPedido],
  templateUrl: './admin-pedidos.html',
})
export class AdminPedidos implements OnInit {

  private readonly pedidoService = inject(AdminPedidoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly terminoBusqueda$ = new Subject<string>();


  // PEDIDOS

  readonly pedidos = signal<PedidoAdmin[]>([]);


  // ESTADO

  readonly cargando = signal(true);
  readonly cambiandoPagina = signal(false);
  readonly buscando = signal(false);
  readonly error = signal<string | null>(null);


  // BUSQUEDA
  readonly busqueda = signal('');


  // FILTRO ESTADO
  readonly estadoSeleccionado = signal<PedidoEstado | ''>('');


  // PAGINACION

  readonly paginaActual = signal(0);
  readonly tamanioPagina = signal(0);
  readonly totalElementos = signal(0);
  readonly totalPaginas = signal(0);


  // ESTADISTICAS

  readonly pendientes = signal(0);
  readonly pagados = signal(0);
  readonly empaquetando = signal(0);
  readonly enviando = signal(0);
  readonly entregados = signal(0);
  readonly cancelados = signal(0);


  readonly pedidoDetalleId = signal<number | null>(null);
  readonly detalleAbierto = signal(false);


  ngOnInit(): void {

    this.cargarPedidos();
    this.cargarEstadisticas();


    this.terminoBusqueda$
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),

        switchMap(valor => {

          this.buscando.set(true);
          this.error.set(null);

          return this.pedidoService
            .listar(0, this.estadoSeleccionado(), valor)
            .pipe(

              catchError(() => {

                this.error.set('No se pudieron cargar los pedidos.');

                this.buscando.set(false);

                return EMPTY;

              })

            );

        }),

        takeUntilDestroyed(this.destroyRef)

      )
      .subscribe(response => {

        this.pedidos.set(response.contenido);

        this.paginaActual.set(response.pagina);

        this.tamanioPagina.set(response.tamanio);

        this.totalElementos.set(response.totalElementos);

        this.totalPaginas.set(response.totalPaginas);

        this.buscando.set(false);

        this.cambiandoPagina.set(false);

      });

  }


  // PAGINACION

  protected ultimoElemento(): number {

    return Math.min((this.paginaActual() + 1) * this.tamanioPagina(), this.totalElementos());

  }


  irAPagina(pagina: number): void {

    if (
      pagina < 0 ||
      pagina >= this.totalPaginas() ||
      pagina === this.paginaActual() ||
      this.cambiandoPagina()
    ) {

      return;

    }


    this.cambiandoPagina.set(true);

    this.cargarPedidos(pagina);

  }


  paginaAnterior(): void {

    this.irAPagina(this.paginaActual() - 1);

  }


  paginaSiguiente(): void {

    this.irAPagina(this.paginaActual() + 1);

  }


  // PEDIDOS

  cargarPedidos(pagina: number = 0): void {

    this.cargando.set(pagina === 0);

    this.error.set(null);


    this.pedidoService
      .listar(pagina, this.estadoSeleccionado(), this.busqueda()).subscribe({

        next: response => {

          this.pedidos.set(response.contenido);

          this.paginaActual.set(response.pagina);

          this.tamanioPagina.set(response.tamanio);

          this.totalElementos.set(response.totalElementos);

          this.totalPaginas.set(response.totalPaginas);

          this.cargando.set(false);

          this.cambiandoPagina.set(false);

        },

        error: () => {

          this.error.set('No se pudieron cargar los pedidos.');

          this.cargando.set(false);

          this.cambiandoPagina.set(false);

        }

      });

  }


  // ESTADISTICAS

  cargarEstadisticas(): void {

    this.pedidoService
      .obtenerEstadisticas()
      .subscribe({

        next: estadisticas => {

          this.pendientes.set(estadisticas.pendientes);

          this.pagados.set(estadisticas.pagados);

          this.empaquetando.set(estadisticas.empaquetando);

          this.enviando.set(estadisticas.enviando);

          this.entregados.set(estadisticas.entregados);

          this.cancelados.set(estadisticas.cancelados);

        },

        error: () => {

          this.error.set('No se pudieron cargar las estadísticas de pedidos.');

        }

      });

  }

  verDetalle(pedido: PedidoAdmin): void {
    this.pedidoDetalleId.set(pedido.id);
    this.detalleAbierto.set(true);

  }

  cerrarDetalle(): void {
    this.detalleAbierto.set(false);
    this.pedidoDetalleId.set(null);
  }



  // BUSQUEDA

  actualizarBusqueda(valor: string): void {
    this.busqueda.set(valor);
    this.terminoBusqueda$.next(valor);
  }


  // FILTRO ESTADO

  cambiarEstado(estado: PedidoEstado | ''): void {
    this.estadoSeleccionado.set(estado);
    this.cargarPedidos(0);
  }

  // ESTADO DEL PEDIDO

  cambiarEstadoPedido(pedido: PedidoAdmin, estado: PedidoEstado): void {

    const siguiente = this.siguienteEstado(pedido.estado);

    // Si el pedido no puede avanzar
    if (!siguiente) {
      return;
    }

    // Solo permitimos avanzar al siguiente estado
    if (estado !== siguiente) {
      return;
    }

    this.error.set(null);

    this.pedidoService
      .actualizarEstado(pedido.id, { estado })
      .subscribe({

        next: pedidoActualizado => {

          this.pedidos.update(
            pedidos =>
              pedidos.map(p => p.id === pedido.id ? { ...p, estado: pedidoActualizado.estado } : p)
          );

          this.cargarEstadisticas();

        },

        error: error => {

          this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado del pedido.');

          // Volvemos a cargar para asegurarnos de tener el estado real del backend
          this.cargarPedidos(
            this.paginaActual()
          );

        }

      });

  }

  // ESTADO DEL PEDIDO

  protected siguienteEstado(estado: PedidoEstado): PedidoEstado | null {

    switch (estado) {

      case 'PAGADO':
        return 'EMPAQUETANDO';

      case 'EMPAQUETANDO':
        return 'ENVIANDO';

      case 'ENVIANDO':
        return 'ENTREGADO';

      default:
        return null;
    }

  }


  // Metodos Auxiliares VIEW

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


  protected estadoPuedeAvanzar(estado: PedidoEstado): boolean {

    return (
      estado === 'PAGADO' ||
      estado === 'EMPAQUETANDO' ||
      estado === 'ENVIANDO'
    );

  }

}
