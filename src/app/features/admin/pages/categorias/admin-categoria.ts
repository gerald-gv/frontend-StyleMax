import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AdminCategoriaService } from '../../services/admin-categoria.service';
import { CategoriaAdmin } from '../../models/categoria-admin.model';
import { ModalCategoria } from "./components/modal-categoria/modal-categoria";
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBarAdmin } from '../../../../shared/components/search-bar-admin/search-bar-admin';

@Component({
  selector: 'app-categoria',
  imports: [SearchBarAdmin, ModalCategoria],
  templateUrl: './admin-categoria.html',
})
export class AdminCategorias implements OnInit {

  private readonly categoriaService = inject(AdminCategoriaService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly terminoBusqueda$ = new Subject<string>();


  readonly categorias = signal<CategoriaAdmin[]>([]);
  readonly cargando = signal(true);
  readonly cambiandoPagina = signal(false);
  readonly buscando = signal(false);
  readonly error = signal<string | null>(null);
  readonly busqueda = signal('');


  // PAGINACION

  readonly paginaActual = signal(0);
  readonly tamanioPagina = signal(0);
  readonly totalElementos = signal(0);
  readonly totalPaginas = signal(0);


  // ESTADISTICAS

  readonly totalCategorias = signal(0);
  readonly categoriasActivas = signal(0);
  readonly categoriasInactivas = signal(0);


  // MODAL

  readonly modalCategoriaAbierto = signal(false);
  readonly categoriaSeleccionada = signal<CategoriaAdmin | null>(null);


  ngOnInit(): void {

    this.cargarCategorias();

    this.cargarEstadisticas();


    this.terminoBusqueda$
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        switchMap(valor => {

          this.buscando.set(true);
          this.error.set(null);

          return this.categoriaService.listar(0, valor).pipe(

            catchError(() => {
              this.error.set('No se pudieron cargar las categorías.');
              this.buscando.set(false);

              return EMPTY;

            })

          );

        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {

        this.categorias.set(response.contenido);
        this.paginaActual.set(response.pagina);
        this.tamanioPagina.set(response.tamanio);
        this.totalElementos.set(response.totalElementos);
        this.totalPaginas.set(response.totalPaginas);

        this.buscando.set(false);
        this.cambiandoPagina.set(false);

      });

  }


  // CATEGORIAS

  cargarCategorias(pagina: number = 0): void {

    this.cargando.set(
      pagina === 0
    );

    this.error.set(null);

    this.categoriaService
      .listar(pagina, this.busqueda()).subscribe({

        next: response => {

          this.categorias.set(response.contenido);
          this.paginaActual.set(response.pagina);
          this.tamanioPagina.set(response.tamanio);
          this.totalElementos.set(response.totalElementos);
          this.totalPaginas.set(response.totalPaginas);

          this.cargando.set(false);
          this.cambiandoPagina.set(false);

        },

        error: () => {

          this.error.set('No se pudieron cargar las categorías.');

          this.cargando.set(false);
          this.cambiandoPagina.set(false);

        }

      });

  }


  // ESTADISTICAS

  cargarEstadisticas(): void {

    this.categoriaService.obtenerEstadisticas().subscribe({

      next: estadisticas => {
        this.totalCategorias.set(estadisticas.total);
        this.categoriasActivas.set(estadisticas.activas);
        this.categoriasInactivas.set(estadisticas.inactivas);
      },

      error: () => {
        this.error.set('No se pudieron cargar las estadísticas de categorías.');
      }

    });

  }


  // BUSQUEDA

  actualizarBusqueda(valor: string): void {
    this.busqueda.set(valor);
    this.terminoBusqueda$.next(valor);
  }


  // PAGINACION

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
    this.cargarCategorias(pagina);

  }


  paginaAnterior(): void {
    this.irAPagina(this.paginaActual() - 1);
  }


  paginaSiguiente(): void {
    this.irAPagina(this.paginaActual() + 1);
  }


  ultimoElemento(): number {
    return Math.min((this.paginaActual() + 1) * this.tamanioPagina(), this.totalElementos());
  }


  // MODAL

  nuevaCategoria(): void {
    this.categoriaSeleccionada.set(null);
    this.modalCategoriaAbierto.set(true);
  }


  editarCategoria(categoria: CategoriaAdmin): void {
    this.categoriaSeleccionada.set(categoria);
    this.modalCategoriaAbierto.set(true);
  }


  cerrarModalCategoria(): void {
    this.modalCategoriaAbierto.set(false);
    this.categoriaSeleccionada.set(null);
  }


  categoriaGuardada(categoria: CategoriaAdmin): void {

    this.categorias.update(
      categorias => {
        const existe = categorias.some(c => c.id === categoria.id );


        if (existe) {
          return categorias.map(c =>c.id === categoria.id? categoria: c);
        }

        return [categoria,...categorias];
      }
    );


    this.cerrarModalCategoria();
    this.cargarEstadisticas();
  }


  // ELIMINAR / DESACTIVAR

  eliminarCategoria(categoria: CategoriaAdmin): void {

    const confirmado = window.confirm(`¿Deseas desactivar la categoría "${categoria.nombre}"?`);

    if (!confirmado) {
      return;
    }


    this.categoriaService.eliminar(categoria.id)
      .subscribe({

        next: categoriaActualizada => {

          this.categorias.update(
            categorias =>
              categorias.map(c => c.id === categoriaActualizada.id ? categoriaActualizada : c )
          );

          this.cargarEstadisticas();

        },

        error: () => {
          this.error.set('No se pudo desactivar la categoría.');
        }

      });

  }

}