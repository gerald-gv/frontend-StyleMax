import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { Categoria } from '../../../../core/models/categoria.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'categorias-clasicas',
  imports: [RouterLink],
  templateUrl: './categorias-clasicas.html',
})
export class CategoriasClasicas implements OnInit {

    private readonly categoriaService = inject(CategoriaService);

    readonly categorias = signal<Categoria[]>([]);

    ngOnInit(): void {

        this.categoriaService.listar().subscribe({

            next: categorias => {
                this.categorias.set( categorias.slice(0, 4));
            },

            error: error => {
                console.error('No se pudieron cargar las categorías.');
            }

        });

    }

    obtenerImagenCategoria(nombre: string): string {

    const nombreNormalizado = nombre
        .toLowerCase()
        .trim();

    const imagenes: Record<string, string> = {
        chaquetas: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        jeans: 'https://images.unsplash.com/photo-1714729382668-7bc3bb261662?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        polos: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        zapatillas: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=796&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    };

    return imagenes[nombreNormalizado]
        ?? '/assets/images/categories/default.jpg';
}

}
