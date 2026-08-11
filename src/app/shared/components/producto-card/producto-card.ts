import { Component, input } from '@angular/core';
import { Producto } from '../../../core/models/producto.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'producto-card',
  imports: [RouterLink],
  templateUrl: './producto-card.html',
})
export class ProductoCard {
  producto = input.required<Producto>();

}
