import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../../../core/services/producto.service';
import { ProductoDetalle } from '../../../../core/models/producto-detalle.model';
import { AuthRequiredModal } from '../../../../shared/components/auth-require-modal/auth-require-modal';
import { AuthService } from '../../../../core/services/auth.service';
import { CarritoService } from '../../../../core/services/carrito.service';
import { DecimalPipe } from '@angular/common';
import { FavoritoService } from '../../../../core/services/favorito.service';

type Estado = 'loading' | 'error' | 'success';

@Component({
  selector: 'producto-detalle',
  imports: [RouterLink, AuthRequiredModal,DecimalPipe],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetallePage implements OnInit {

  private readonly route = inject(ActivatedRoute)
  private readonly productoService = inject(ProductoService);
  private readonly authService = inject(AuthService);
  private readonly carritoService = inject(CarritoService);
  private readonly favoritoService = inject(FavoritoService);

  producto = signal<ProductoDetalle | null>(null)

  estado = signal<Estado>('loading')
  mostrarAuthModal = signal(false);

  agregandoAlCarrito = signal(false);
  procesandoFavorito = signal(false);

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');

      if (!slug) {
        this.estado.set('error');
        return;
      }

      this.cargarProducto(slug);

    });

  }

  private cargarProducto(slug: string): void {

    this.estado.set('loading')

    this.productoService.obtenerPorSlug(slug).subscribe({
      next: (producto) => {
        this.producto.set(producto)
        this.estado.set('success')
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.estado.set('error');
      }
    })
  }

  toggleFavorito(): void {

    if (!this.authService.autenticado()) {
      this.mostrarAuthModal.set(true);
      return;
    }

    if (this.procesandoFavorito()) {
      return;
    }

    const productoActual = this.producto();

    if (!productoActual) {
      return;
    }

    const esFavorito = productoActual.favorito;

    this.procesandoFavorito.set(true);

    if (esFavorito) {

      this.favoritoService.eliminar(productoActual.id).subscribe({

        next: () => {

          this.producto.update(producto => {

            if (!producto) {
              return producto;
            }

            return {
              ...producto,
              favorito: false
            };

          });

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

    this.favoritoService.agregar(productoActual.id).subscribe({

      next: () => {

        this.producto.update(producto => {

          if (!producto) {
            return producto;
          }

          return {
            ...producto,
            favorito: true
          };

        });

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

  agregarAlCarrito(): void {

    if (!this.authService.autenticado()) {
      this.mostrarAuthModal.set(true);
      return;
    }

    const productoActual = this.producto();

    if (!productoActual || productoActual.stock <= 0) {
      return;
    }

    this.agregandoAlCarrito.set(true);

    this.carritoService.agregarItem(productoActual.id,1).subscribe({
        next: () => {
            this.agregandoAlCarrito.set(false);
        },

        error: (error) => {
            console.error('Error al agregar el producto:', error);
            this.agregandoAlCarrito.set(false);
        }
    });
  }

  cerrarAuthModal(): void {
    this.mostrarAuthModal.set(false);
  }


}
