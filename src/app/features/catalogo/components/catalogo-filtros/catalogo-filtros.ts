import { Component, computed, input, output, signal } from '@angular/core';
import { Categoria } from '../../../../core/models/categoria.model';
import { Marca } from '../../../../core/models/marca.model';

type Fit = 'SLIM' | 'REGULAR' | 'OVERSIZE';

interface FitOption {
  value: Fit;
  label: string;
}


@Component({
  selector: 'catalogo-filtros',
  imports: [],
  templateUrl: './catalogo-filtros.html',
})
export class CatalogoFiltros {

  // Inputs

  readonly categorias = input<Categoria[]>([]);
  readonly marcas = input<Marca[]>([]);

  readonly categoriaSeleccionada = input<number | undefined>();
  readonly marcaSeleccionada = input<number | undefined>();
  readonly fitSeleccionado = input<string | undefined>();


  // Outputs

  readonly categoriaChange = output<number | undefined>();
  readonly marcaChange = output<number | undefined>();
  readonly fitChange = output<string | undefined>();


  readonly maxOpcionesIniciales = 5;


  // Opciones de Fit

  readonly fits: readonly FitOption[] = [
    {
      value: 'SLIM',
      label: 'Slim',
    },
    {
      value: 'REGULAR',
      label: 'Regular',
    },
    {
      value: 'OVERSIZE',
      label: 'Oversize',
    },
  ];


  // Estado de los acordeones

  readonly categoriaExpandida = signal(false);
  readonly marcaExpandida = signal(false);
  readonly fitExpandido = signal(false);


  // Estado de listas largas

  readonly categoriasMostrarTodas = signal(false);
  readonly marcasMostrarTodas = signal(false);


  readonly cantidadFiltrosActivos = computed(() => {

    let cantidad = 0;

    if (this.categoriaSeleccionada() !== undefined) {
      cantidad++;
    }

    if (this.marcaSeleccionada() !== undefined) {
      cantidad++;
    }

    if (this.fitSeleccionado() !== undefined) {
      cantidad++;
    }

    return cantidad;

  });


  readonly tieneFiltros = computed(() => this.cantidadFiltrosActivos() > 0);


  readonly categoriasVisibles = computed(() => {

    const categorias = this.categorias();

    if ( this.categoriasMostrarTodas() || categorias.length <= this.maxOpcionesIniciales) {
      return categorias;
    }

    return this.obtenerOpcionesIniciales( categorias,this.categoriaSeleccionada());

  });


  readonly marcasVisibles = computed(() => {

    const marcas = this.marcas();

    if (this.marcasMostrarTodas() ||marcas.length <= this.maxOpcionesIniciales) {
      return marcas;
    }

    return this.obtenerOpcionesIniciales(marcas,this.marcaSeleccionada());

  });


  // Accordion

  toggleCategoria(): void {
    this.categoriaExpandida.update(expandida => !expandida);
  }


  toggleMarca(): void {
    this.marcaExpandida.update(expandida => !expandida);
  }


  toggleFit(): void {
    this.fitExpandido.update(expandido => !expandido);
  }


  // Mostrar todas

  toggleTodasCategorias(): void {
    this.categoriasMostrarTodas.update(mostrar => !mostrar);
  }


  toggleTodasMarcas(): void {
    this.marcasMostrarTodas.update(mostrar => !mostrar);
  }

  // Selección de filtros

  seleccionarCategoria(id: number): void {
    this.categoriaChange.emit( this.categoriaSeleccionada() === id ? undefined : id );
  }


  seleccionarMarca(id: number): void {
    this.marcaChange.emit( this.marcaSeleccionada() === id ? undefined : id );
  }


  seleccionarFit(fit: Fit): void {
    this.fitChange.emit( this.fitSeleccionado() === fit ? undefined : fit );
  }


  // Limpiar

  limpiarFiltros(): void {

    this.categoriaChange.emit(undefined);
    this.marcaChange.emit(undefined);
    this.fitChange.emit(undefined);

  }


  // Helpers

  private obtenerOpcionesIniciales<T extends { id: number }>(
    opciones: T[],
    seleccionada?: number,
  ): T[] {

    const visibles = opciones.slice(0, this.maxOpcionesIniciales);

    if ( seleccionada === undefined || visibles.some(opcion => opcion.id === seleccionada) ) {
      return visibles;
    }

    const opcionSeleccionada = opciones.find( opcion => opcion.id === seleccionada );

    return opcionSeleccionada ? [...visibles, opcionSeleccionada] : visibles;

  }

}