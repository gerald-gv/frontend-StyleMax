import { Component, inject, OnInit, signal } from "@angular/core";
import { ProductoCard } from "../../../../shared/components/producto-card/producto-card";
import { FavoritoService } from "../../../../core/services/favorito.service";
import { Favorito } from "../../../../core/models/favorito.model";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'mis-favoritos',
    imports: [ProductoCard, RouterLink],
    templateUrl: './mis-favoritos.html',
})
export class MisFavoritos implements OnInit {

    private readonly favoritoService = inject(FavoritoService);

    readonly favoritos = signal<Favorito[]>([]);

    readonly cargando = signal(true);
    readonly error = signal<string | null>(null);

    readonly pagina = signal(0);
    readonly tamanio = signal(8);

    readonly totalElementos = signal(0);
    readonly totalPaginas = signal(0);
    readonly ultima = signal(true);

    ngOnInit(): void {
        this.cargarFavoritos();
    }

    cargarFavoritos(): void {

        this.cargando.set(true);
        this.error.set(null);

        this.favoritoService
            .listar(this.pagina(), this.tamanio())
            .subscribe({

                next: respuesta => {


                    const favoritos = respuesta.contenido.map(favorito => ({
                        ...favorito,
                        producto: {
                            ...favorito.producto,
                            favorito: true
                        }
                    }));

                    this.favoritos.set(favoritos);

                    this.pagina.set(respuesta.pagina);
                    this.tamanio.set(respuesta.tamanio);
                    this.totalElementos.set(respuesta.totalElementos);
                    this.totalPaginas.set(respuesta.totalPaginas);
                    this.ultima.set(respuesta.ultima);

                    this.cargando.set(false);
                },

                error: error => {

                    console.error(
                        'No se pudieron cargar los favoritos:',
                        error
                    );

                    this.error.set(
                        'No se pudieron cargar tus favoritos.'
                    );

                    this.cargando.set(false);
                }
            });
    }

    cambiarPagina(nuevaPagina: number): void {

        if (
            nuevaPagina < 0 ||
            nuevaPagina >= this.totalPaginas() ||
            nuevaPagina === this.pagina() ||
            this.cargando()
        ) {
            return;
        }

        this.pagina.set(nuevaPagina);

        this.cargarFavoritos();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    paginaAnterior(): void {
        this.cambiarPagina(this.pagina() - 1);
    }

    paginaSiguiente(): void {
        this.cambiarPagina(this.pagina() + 1);
    }

    favoritoCambiado(
        productoId: number,
        esFavorito: boolean
    ): void {


        if (esFavorito) {
            return;
        }


        this.favoritos.update(
            favoritos =>
                favoritos.filter(
                    favorito =>
                        favorito.productoId !== productoId
                )
        );

        this.totalElementos.update(
            total => Math.max(0, total - 1)
        );


        if (this.favoritos().length > 0) {
            return;
        }


        if (this.pagina() > 0) {

            this.pagina.update(
                pagina => pagina - 1
            );

            this.cargarFavoritos();

            return;
        }


        this.cargarFavoritos();
    }
}