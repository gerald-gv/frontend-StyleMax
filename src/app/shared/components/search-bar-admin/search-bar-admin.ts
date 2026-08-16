import { Component, input, output } from '@angular/core';

@Component({
  selector: 'search-bar-admin',
  imports: [],
  templateUrl: './search-bar-admin.html',
})
export class SearchBarAdmin {

  readonly placeholder = input('Buscar...');

  readonly busqueda = input('');

  readonly cantidadTotal = input(0);

  readonly cantidadFiltrada = input(0);

  readonly busquedaChange = output<string>();


  actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busquedaChange.emit(input.value);
  }

}
