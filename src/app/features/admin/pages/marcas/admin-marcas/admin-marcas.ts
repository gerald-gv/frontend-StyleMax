import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MarcaAdmin } from '../../../models/marca-admin.model';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap } from 'rxjs';
import { AdminMarcaService } from '../../../services/admin-marca.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalMarca } from "../components/modal-marca/modal-marca";

@Component({
  selector: 'admin-marcas',
  imports: [ModalMarca],
  templateUrl: './admin-marcas.html',
})
export class AdminMarcas implements OnInit {

  private readonly marcaService = inject(AdminMarcaService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly terminoBusqueda$ = new Subject<string>();


  // MARCAS

  readonly marcas = signal<MarcaAdmin[]>([]);


  // ESTADO

  readonly cargando = signal(true);
  readonly cambiandoPagina = signal(false);
  readonly buscando = signal(false);

  readonly error = signal<string | null>(null);


  // BUSQUEDA

  readonly busqueda = signal('');


  // PAGINACION

  readonly paginaActual = signal(0);
  readonly tamanioPagina = signal(0);
  readonly totalElementos = signal(0);
  readonly totalPaginas = signal(0);


  // ESTADISTICAS

  readonly totalMarcas = signal(0);
  readonly marcasActivas = signal(0);
  readonly marcasInactivas = signal(0);


  // MODAL MARCA

  readonly modalMarcaAbierto = signal(false);
  readonly marcaSeleccionada = signal<MarcaAdmin | null>(null);


  ngOnInit(): void {

    this.cargarMarcas();
    this.cargarEstadisticas();


    this.terminoBusqueda$
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),

        switchMap(valor => {

          this.buscando.set(true);
          this.error.set(null);

          return this.marcaService.listar(0, valor).pipe(

            catchError(() => {

              this.error.set(
                'No se pudieron cargar las marcas.'
              );

              this.buscando.set(false);

              return EMPTY;
            })

          );

        }),

        takeUntilDestroyed(this.destroyRef)

      )
      .subscribe(response => {

        this.marcas.set(response.contenido);

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

    return Math.min(
      (this.paginaActual() + 1) * this.tamanioPagina(),
      this.totalElementos()
    );

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

    this.cargarMarcas(pagina);

  }


  paginaAnterior(): void {

    this.irAPagina(
      this.paginaActual() - 1
    );

  }


  paginaSiguiente(): void {

    this.irAPagina(
      this.paginaActual() + 1
    );

  }


  // MARCAS

  cargarMarcas(pagina: number = 0): void {

    this.cargando.set(pagina === 0);
    this.error.set(null);

    this.marcaService.listar(
      pagina,
      this.busqueda()
    ).subscribe({

      next: response => {

        this.marcas.set(response.contenido);

        this.paginaActual.set(response.pagina);
        this.tamanioPagina.set(response.tamanio);
        this.totalElementos.set(response.totalElementos);
        this.totalPaginas.set(response.totalPaginas);

        this.cargando.set(false);
        this.cambiandoPagina.set(false);

      },

      error: () => {

        this.error.set(
          'No se pudieron cargar las marcas.'
        );

        this.cargando.set(false);
        this.cambiandoPagina.set(false);

      }

    });

  }


  // ESTADISTICAS

  cargarEstadisticas(): void {

    this.marcaService
      .obtenerEstadisticas()
      .subscribe({

        next: estadisticas => {

          this.totalMarcas.set(
            estadisticas.total
          );

          this.marcasActivas.set(
            estadisticas.activas
          );

          this.marcasInactivas.set(
            estadisticas.inactivas
          );

        },

        error: () => {

          this.error.set(
            'No se pudieron cargar las estadísticas de marcas.'
          );

        }

      });

  }


  // BUSQUEDA

  actualizarBusqueda(valor: string): void {

    this.busqueda.set(valor);

    this.terminoBusqueda$.next(valor);

  }


  // MODAL MARCA

  marcaGuardada(marca: MarcaAdmin): void {

    this.marcas.update(marcas => {

      const existe = marcas.some(
        m => m.id === marca.id
      );

      if (existe) {

        return marcas.map(
          m => m.id === marca.id
            ? marca
            : m
        );

      }

      return [
        marca,
        ...marcas
      ];

    });


    this.modalMarcaAbierto.set(false);
    this.marcaSeleccionada.set(null);

    this.cargarEstadisticas();

  }


  nuevaMarca(): void {

    this.marcaSeleccionada.set(null);

    this.modalMarcaAbierto.set(true);

  }


  editarMarca(marca: MarcaAdmin): void {

    this.marcaSeleccionada.set(marca);

    this.modalMarcaAbierto.set(true);

  }


  cerrarModalMarca(): void {

    this.modalMarcaAbierto.set(false);

    this.marcaSeleccionada.set(null);

  }


  // DESACTIVAR

  eliminarMarca(marca: MarcaAdmin): void {

    const confirmado = window.confirm(
      `¿Deseas desactivar la marca "${marca.nombre}"?`
    );

    if (!confirmado) {
      return;
    }


    this.marcaService
      .eliminar(marca.id)
      .subscribe({

        next: marcaActualizada => {

          this.marcas.update(
            marcas =>
              marcas.map(
                m =>
                  m.id === marcaActualizada.id
                    ? marcaActualizada
                    : m
              )
          );

          this.cargarEstadisticas();

        },

        error: () => {

          this.error.set(
            'No se pudo desactivar la marca.'
          );

        }

      });

  }

}