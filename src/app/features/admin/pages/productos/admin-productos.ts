import { DecimalPipe } from "@angular/common";
import { Component, computed, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { AdminProductoService } from "../../services/admin-producto.service";
import { ProductoAdmin } from "../../models/producto-admin.model";
import { SearchBarAdmin } from "../../../../shared/components/search-bar-admin/search-bar-admin";
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ModalProducto } from "./components/modal-producto/modal-producto";
import { MarcaService } from "../../../../core/services/marca.service";
import { CategoriaService } from "../../../../core/services/categoria.service";
import { Marca } from "../../../../core/models/marca.model";
import { Categoria } from "../../../../core/models/categoria.model";
import { NotificationService } from "../../../../core/services/notification.service";
import { ConfirmationModal } from "../../shared/components/confirmation-modal/confirmation-modal";

@Component({
    selector: 'admin-productos',
    imports: [DecimalPipe, SearchBarAdmin, ModalProducto, ConfirmationModal],
    templateUrl: './admin-productos.html'
})
export class AdminProductos implements OnInit {

    private readonly productoService = inject(AdminProductoService);
    private readonly marcaService = inject(MarcaService);
    private readonly categoriaService = inject(CategoriaService);

    private readonly notification = inject(NotificationService);

    readonly marcas = signal<Marca[]>([]);
    readonly categorias = signal<Categoria[]>([]);

    readonly fits = [
        'REGULAR',
        'SLIM',
        'OVERSIZE',
        'RELAXED'
    ];

    private readonly destroyRef = inject(DestroyRef);

    private readonly terminoBusqueda$ = new Subject<string>();

    readonly productos = signal<ProductoAdmin[]>([]);

    readonly cargando = signal(true);
    readonly cambiandoPagina = signal(false);

    readonly error = signal<string | null>(null);

    readonly busqueda = signal('');
    readonly buscando = signal(false);

    // PAGINACION

    readonly paginaActual = signal(0);
    readonly tamanioPagina = signal(0);
    readonly totalElementos = signal(0);
    readonly totalPaginas = signal(0);

    // ESTADISTICAS

    readonly totalProductos = signal(0);
    readonly productosActivos = signal(0);
    readonly productosSinStock = signal(0);
    readonly productosDestacados = signal(0);

    // MODAL PRODUCTO
    readonly modalProductoAbierto = signal(false);
    readonly productoSeleccionado = signal<ProductoAdmin | null>(null);

    // MODAL CONFIRMACION
    readonly modalConfirmacionAbierto = signal(false);
    readonly productoAEliminar = signal<ProductoAdmin | null>(null);

    readonly mensajeConfirmacion = computed(() => {

        const producto = this.productoAEliminar();

        return producto ? `¿Deseas desactivar el producto "${producto.nombre}"?` : '';
    });

    ngOnInit(): void {
        this.cargarProductos();
        this.cargarEstadisticas();
        this.cargarMarcas();
        this.cargarCategorias();

        this.terminoBusqueda$.pipe(
            debounceTime(800),
            distinctUntilChanged(),

            switchMap(valor => {

                this.buscando.set(true);
                this.error.set(null);

                return this.productoService.listar(0, valor).pipe(

                    catchError(() => {

                        this.error.set(
                            'No se pudieron cargar los productos.'
                        );

                        this.buscando.set(false);

                        return EMPTY;
                    })

                );

            }),

            takeUntilDestroyed(this.destroyRef)

        )
            .subscribe(response => {

                this.productos.set(response.contenido);

                this.paginaActual.set(response.pagina);
                this.tamanioPagina.set(response.tamanio);
                this.totalElementos.set(response.totalElementos);
                this.totalPaginas.set(response.totalPaginas);

                this.buscando.set(false);
                this.cambiandoPagina.set(false);
            });
    }

    protected ultimoElemento(): number {
        return Math.min(
            (this.paginaActual() + 1) * this.tamanioPagina(),
            this.totalElementos()
        );
    }

    // PRODUCTOS

    cargarProductos(pagina: number = 0): void {

        this.cargando.set(pagina === 0);
        this.error.set(null);

        this.productoService.listar(
            pagina,
            this.busqueda()
        ).subscribe({

            next: (response) => {

                this.productos.set(response.contenido);

                this.paginaActual.set(response.pagina);
                this.tamanioPagina.set(response.tamanio);
                this.totalElementos.set(response.totalElementos);
                this.totalPaginas.set(response.totalPaginas);

                this.cargando.set(false);
                this.cambiandoPagina.set(false);
            },

            error: () => {
                this.error.set('No se pudieron cargar los productos.');

                this.cargando.set(false);
                this.cambiandoPagina.set(false);
            }

        });
    }


    // ESTADISTICAS

    cargarEstadisticas(): void {

        this.productoService.obtenerEstadisticas().subscribe({

            next: (estadisticas) => {

                this.totalProductos.set(estadisticas.total);
                this.productosActivos.set(estadisticas.activos);
                this.productosSinStock.set(estadisticas.sinStock);
                this.productosDestacados.set(estadisticas.destacados);

            },

            error: () => {
                this.error.set('No se pudieron cargar las estadísticas de productos.');
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

        this.cargarProductos(pagina);
    }


    paginaAnterior(): void {
        this.irAPagina(
            this.paginaActual() - 1
        );
    }


    paginaSiguiente(): void {
        this.irAPagina(
            this.paginaActual() + 1
        );
    }

    // PRODUCTOS

    productoGuardado(producto: ProductoAdmin): void {

        const productoAnterior = this.productos().find(
            p => p.id === producto.id
        );

        const esNuevo = !productoAnterior;

        this.productos.update(productos => {

            if (esNuevo) {
                return [producto, ...productos];
            }

            return productos.map(p =>
                p.id === producto.id
                    ? producto
                    : p
            );
        });

        this.modalProductoAbierto.set(false);
        this.productoSeleccionado.set(null);

        this.cargarEstadisticas();

        // NUEVO
        if (esNuevo) {
            this.notification.success(
                `Producto "${producto.nombre}" creado correctamente.`
            );
            return;
        }

        // INTENTO DE ACTIVACIÓN SIN STOCK
        if (
            !productoAnterior!.activo &&
            !producto.activo &&
            producto.stock === 0
        ) {
            this.notification.warning(`El producto "${producto.nombre}" no se pudo activar porque no tiene stock.`);
            return;
        }

        if (productoAnterior!.activo !== producto.activo) {

            this.notification.success(
                producto.activo
                    ? `Producto "${producto.nombre}" activado correctamente.`
                    : `Producto "${producto.nombre}" desactivado correctamente.`
            );

            return;
        }

        this.notification.success(`Producto "${producto.nombre}" actualizado correctamente.`);
    }

    nuevoProducto(): void {
        this.productoSeleccionado.set(null);
        this.modalProductoAbierto.set(true);
    }


    editarProducto(producto: ProductoAdmin): void {
        this.productoSeleccionado.set(producto);
        this.modalProductoAbierto.set(true);
    }

    cerrarModalProducto(): void {
        this.modalProductoAbierto.set(false);
        this.productoSeleccionado.set(null);
    }

    eliminarProducto(producto: ProductoAdmin): void {

        this.productoAEliminar.set(producto);
        this.modalConfirmacionAbierto.set(true);
    }

    confirmarDesactivacionProducto(): void {

        const producto = this.productoAEliminar();

        if (!producto) {
            return;
        }


        this.productoService
            .eliminar(producto.id)
            .subscribe({

                next: productoActualizado => {

                    this.productos.update(
                        productos =>
                            productos.map(
                                p =>
                                    p.id === productoActualizado.id
                                        ? productoActualizado
                                        : p
                            )
                    );

                    this.cargarEstadisticas();

                    this.notification.success(
                        `Producto "${producto.nombre}" desactivado correctamente.`
                    );

                    this.cerrarConfirmacion();

                },

                error: () => {

                    this.notification.error(
                        `No se pudo desactivar el producto "${producto.nombre}".`
                    );

                    this.cerrarConfirmacion();

                }

            });

    }

    cerrarConfirmacion(): void {

        this.modalConfirmacionAbierto.set(false);
        this.productoAEliminar.set(null);

    }


    private cargarMarcas(): void {
        this.marcaService.listar().subscribe({
            next: marcas => {
                this.marcas.set(marcas);
            },
            error: () => {
                this.error.set('No se pudieron cargar las marcas.');
            }
        });
    }

    private cargarCategorias(): void {
        this.categoriaService.listar().subscribe({
            next: categorias => {
                this.categorias.set(categorias);
            },
            error: () => {
                this.error.set('No se pudieron cargar las categorías.');
            }
        });
    }
}