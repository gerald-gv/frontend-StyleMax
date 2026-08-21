import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Producto } from '../../../core/models/producto.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FavoritoService } from '../../../core/services/favorito.service';

@Component({
  selector: 'producto-card',
  imports: [RouterLink],
  templateUrl: './producto-card.html',
})
export class ProductoCard {

  private readonly authService = inject(AuthService);
  private readonly favoritoService = inject(FavoritoService);

  producto = input.required<Producto>();
  compact = input(false);

  readonly seleccionado = output<void>();
  readonly favoritoCambiado = output<boolean>();

  readonly procesandoFavorito = signal(false);
  readonly favoritoActivo = signal(false);

  constructor() {

    effect(() => {

      this.favoritoActivo.set(
        this.producto().favorito
      );

    });

  }

  toggleFavorito(event: MouseEvent): void {

    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.autenticado()) {
      return;
    }

    if (this.procesandoFavorito()) {
      return;
    }

    const productoId = this.producto().id;
    const esFavorito = this.favoritoActivo();

    this.procesandoFavorito.set(true);

    if (esFavorito) {

      this.favoritoService.eliminar(productoId).subscribe({

        next: () => {

          this.favoritoActivo.set(false);

          this.producto().favorito = false;

          this.favoritoCambiado.emit(false);

          this.procesandoFavorito.set(false);

        },

        error: error => {

          console.error(
            'No se pudo eliminar el favorito:',
            error
          );

          this.procesandoFavorito.set(false);

        }

      });

      return;
    }

    this.favoritoService.agregar(productoId).subscribe({

      next: () => {

        this.favoritoActivo.set(true);

        this.producto().favorito = true;

        this.favoritoCambiado.emit(true);

        this.procesandoFavorito.set(false);

      },

      error: error => {

        console.error(
          'No se pudo agregar el favorito:',
          error
        );

        this.procesandoFavorito.set(false);

      }

    });

  }
}