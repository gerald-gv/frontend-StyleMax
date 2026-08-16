import { DecimalPipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { AdminProductoService } from "../../services/admin-producto.service";
import { ProductoAdmin } from "../../models/producto-admin.model";
import { Router } from "@angular/router";
import { SearchBarAdmin } from "../../../../shared/components/search-bar-admin/search-bar-admin";

@Component({
    selector: 'admin-productos',
    imports: [DecimalPipe, SearchBarAdmin],
    templateUrl: './admin-productos.html'
})
export class AdminProductos implements OnInit {

    private readonly productoService = inject(AdminProductoService);
    private readonly router = inject(Router);

    readonly productos = signal<ProductoAdmin[]>([]);

    readonly cargando = signal(true);

    readonly error = signal<string | null>(null);

    readonly busqueda = signal('');


    // PRODUCTOS FILTRADOS

    readonly productosFiltrados = computed(() => {

        const termino = this.busqueda().trim().toLowerCase();

        if (!termino) {
            return this.productos();
        }

        return this.productos().filter(producto =>
            producto.nombre.toLowerCase().includes(termino) ||
            producto.slug.toLowerCase().includes(termino) ||
            producto.marca.toLowerCase().includes(termino) ||
            producto.categoria.toLowerCase().includes(termino)
        );
    });


    // ESTADISTICAS

    readonly totalProductos = computed(() => this.productos().length);

    readonly productosActivos = computed(() => this.productos().filter(producto => producto.activo).length);

    readonly productosSinStock = computed(() => this.productos().filter(producto => producto.stock === 0).length);

    readonly productosDestacados = computed(() => this.productos().filter(producto => producto.destacado).length);

    ngOnInit(): void {
        this.cargarProductos();
    }

    cargarProductos(): void {

        this.cargando.set(true);
        this.error.set(null);

        this.productoService.listarTodos().subscribe({

            next: (productos) => {
                this.productos.set(productos);
                this.cargando.set(false);
            },

            error: () => {
                this.error.set('No se pudieron cargar los productos.');

                this.cargando.set(false);
            }

        });
    }

    actualizarBusqueda(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.busqueda.set(input.value);
    }


    nuevoProducto(): void {
        this.router.navigate(['/admin/productos/nuevo']);
    }


    editarProducto(id: number): void {
        this.router.navigate(['/admin/productos', id, 'editar']);
    }

    eliminarProducto(producto: ProductoAdmin): void {

        const confirmado = window.confirm(`¿Deseas desactivar el producto "${producto.nombre}"?`);

        if (!confirmado) {
            return;
        }

        this.productoService.eliminar(producto.id).subscribe({

            next: (productoActualizado) => {

                this.productos.update(productos => 
                    productos.map(p => p.id === productoActualizado.id ? productoActualizado : p)
                );

            },

            error: () => {
                this.error.set('No se pudo desactivar el producto.');
            }

        });
    }
}