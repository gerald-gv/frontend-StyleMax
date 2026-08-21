import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../../core/services/producto.service';
import { Router } from '@angular/router';
import { Producto } from '../../../core/models/producto.model';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductoCard } from '../producto-card/producto-card';
import { BuscadorService } from '../../../core/services/buscador.service';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule, ProductoCard],
  templateUrl: './search-bar.html',
})
export class SearchBar {

  private readonly productoService = inject(ProductoService);
  private readonly buscadorService = inject(BuscadorService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly query = new FormControl('', { nonNullable: true });

  readonly resultados = signal<Producto[]>([]);
  readonly buscando = signal(false);
  readonly mostrarResultados = signal(false);

  private buscandoPorEnter = false;

  constructor() {

    this.query.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),

        switchMap(query => {

          if (this.buscandoPorEnter) {
            this.buscandoPorEnter = false;
            return of(null);
          }
          const termino = query.trim();

          if (!termino) {
            this.resultados.set([]);
            this.mostrarResultados.set(false);
            this.buscando.set(false);

            return of(null);
          }

          this.buscando.set(true);
          this.mostrarResultados.set(true);
          this.buscadorService.abrir();

          return this.productoService.listarCatalogo(
            0,
            undefined,
            undefined,
            undefined,
            termino,
            6
          ).pipe(
            catchError(() => of(null))
          );

        })
      )
      .subscribe(response => {

        this.buscando.set(false);

        if (!response) {
          this.resultados.set([]);
          return;
        }

        this.resultados.set(response.contenido);

      });
  }

  buscar(): void {

    const termino = this.query.value.trim();

    if (!termino) {
      return;
    }

    // Marcamos que el término actual fue enviado con Enter
    this.buscandoPorEnter = true;

    // Cerramos inmediatamente el panel
    this.mostrarResultados.set(false);
    this.resultados.set([]);
    this.buscando.set(false);
    this.buscadorService.cerrar();

    this.router.navigate(['/catalogo'], {
      queryParams: {
        q: termino
      }
    });
  }

  cerrar(): void {
    this.mostrarResultados.set(false);
    this.buscadorService.cerrar();
  }

  limpiar(): void {
    this.query.setValue('');
    this.resultados.set([]);
    this.mostrarResultados.set(false);
    this.buscadorService.cerrar();
  }

  seleccionarProducto(): void {
    this.query.setValue('', { emitEvent: false });
    this.resultados.set([]);
    this.mostrarResultados.set(false);
    this.buscadorService.cerrar();
  }
}