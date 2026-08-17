import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ProductoService } from '../../../../core/services/producto.service';
import { Producto } from '../../../../core/models/producto.model';
import { ProductoCard } from '../../../../shared/components/producto-card/producto-card';
import { ProductCardSkeleton } from "../../../../shared/components/product-card-skeleton/product-card-skeleton";
import { Categoria } from '../../../../core/models/categoria.model';
import { Marca } from '../../../../core/models/marca.model';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { MarcaService } from '../../../../core/services/marca.service';
import { CatalogoFiltros } from '../../components/catalogo-filtros/catalogo-filtros';

@Component({
  selector: 'catalogo',
  imports: [CatalogoFiltros, ProductoCard, ProductCardSkeleton],
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit, AfterViewInit, OnDestroy {

  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly marcaService = inject(MarcaService);

  readonly productos = signal<Producto[]>([]);
  readonly productosVisibles = signal<Producto[]>([]);

  readonly categorias = signal<Categoria[]>([]);
  readonly marcas = signal<Marca[]>([]);

  readonly categoriaSeleccionada = signal<number | undefined>(undefined);
  readonly marcaSeleccionada = signal<number | undefined>(undefined);
  readonly fitSeleccionado = signal<string | undefined>(undefined);

  readonly paginaActual = signal(0);
  readonly tamanioPagina = signal(0);
  readonly totalPaginas = signal(0);
  readonly totalElementos = signal(0);

  readonly cargando = signal(false);
  readonly cambiandoPagina = signal(false);
  readonly error = signal<string | null>(null);

  private readonly PRODUCTOS_INICIALES = 8;
  private readonly PRODUCTOS_POR_CARGA = 4;

  @ViewChild('sentinel')
  private sentinel!: ElementRef<HTMLElement>;

  private observer?: IntersectionObserver;
  private verificacionEnCurso = false;

  ngOnInit(): void {
    this.cargarFiltros();
    this.cargarPagina(0);
  }

  ngAfterViewInit(): void {

    this.observer = new IntersectionObserver(
      entries => {

        const entry = entries[0];

        if (entry.isIntersecting && !this.cargando() && !this.todosLosProductosVisibles) {
          this.verificarContenidoVisible();
        }

      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0
      }
    );

    this.observer.observe(this.sentinel.nativeElement);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.verificarContenidoVisible();
  }

  ngOnDestroy(): void {

    this.observer?.disconnect();

  }


  cargarPagina(pagina: number, esCambioPagina = false): void {

    if (esCambioPagina) {
      this.cambiandoPagina.set(true);
    } else {
      this.cargando.set(true);
    }

    this.error.set(null);

    this.productoService.listarCatalogo(pagina, this.categoriaSeleccionada(), this.marcaSeleccionada(), this.fitSeleccionado()).subscribe({

      next: (response) => {

        this.productos.set(response.contenido);

        this.productosVisibles.set(
          response.contenido.slice(0, this.PRODUCTOS_INICIALES)
        );

        this.paginaActual.set(response.pagina);
        this.tamanioPagina.set(response.tamanio);
        this.totalPaginas.set(response.totalPaginas);
        this.totalElementos.set(response.totalElementos);

        this.cargando.set(false);
        this.cambiandoPagina.set(false);

        requestAnimationFrame(() => {
          this.verificarContenidoVisible();
        });
      },

      error: () => {

        this.error.set(
          'No se pudieron cargar los productos.'
        );

        this.cargando.set(false);
        this.cambiandoPagina.set(false);
      }

    });
  }


  cargarMasProductos(): void {

    const visibles = this.productosVisibles().length;
    const total = this.productos().length;

    if (visibles >= total) {
      return;
    }

    const siguienteCantidad = Math.min(
      visibles + this.PRODUCTOS_POR_CARGA,
      total
    );

    this.productosVisibles.set(
      this.productos().slice(0, siguienteCantidad)
    );
  }


  private verificarContenidoVisible(): void {

    if (this.verificacionEnCurso || this.cargando() || this.todosLosProductosVisibles) {
      return;
    }

    this.verificacionEnCurso = true;

    const comprobar = () => {

      if (this.cargando() || this.todosLosProductosVisibles) {
        this.verificacionEnCurso = false;
        return;
      }

      const rect = this.sentinel.nativeElement.getBoundingClientRect();

      const sentinelVisible =
        rect.top <= window.innerHeight + 300 &&
        rect.bottom >= 0;

      if (!sentinelVisible) {
        this.verificacionEnCurso = false;
        return;
      }

      this.cargarMasProductos();

      requestAnimationFrame(comprobar);
    };

    requestAnimationFrame(comprobar);
  }


  async irAPagina(pagina: number): Promise<void> {

    if (
      pagina < 0 ||
      pagina >= this.totalPaginas() ||
      pagina === this.paginaActual() ||
      this.cargando() ||
      this.cambiandoPagina()
    ) {
      return;
    }

    this.cambiandoPagina.set(true);

    this.productosVisibles.set([]);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    await this.esperarScrollArriba();

    this.cargarPagina(pagina, true);
  }


  paginaAnterior(): void {
    this.irAPagina(this.paginaActual() - 1);
  }


  paginaSiguiente(): void {
    this.irAPagina(this.paginaActual() + 1);
  }


  get todosLosProductosVisibles(): boolean {
    return this.productosVisibles().length >= this.productos().length;
  }


  get resultadoInicial(): number {

    if (this.totalElementos() === 0) {
      return 0;
    }

    return this.paginaActual() * this.tamanioPagina() + 1;
  }


  get resultadoFinal(): number {

    return Math.min(
      (this.paginaActual() + 1) * this.tamanioPagina(),
      this.totalElementos()
    );
  }

  private aplicarFiltros(): void {

    this.verificacionEnCurso = false;

    this.productos.set([]);
    this.productosVisibles.set([]);

    this.error.set(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.cargarPagina(0);
  }




  private cargarFiltros(): void {

    this.categoriaService.listar().subscribe({
      next: categorias => {
        this.categorias.set(categorias);
      }
    });


    this.marcaService.listar().subscribe({
      next: marcas => {
        this.marcas.set(marcas);
      }
    });

  }

  seleccionarCategoria(id: number | undefined): void {
    this.categoriaSeleccionada.set(id);
    this.aplicarFiltros();

  }


  seleccionarMarca(id: number | undefined): void {
    this.marcaSeleccionada.set(id);
    this.aplicarFiltros();

  }


  seleccionarFit(fit: string | undefined): void {
    this.fitSeleccionado.set(fit);
    this.aplicarFiltros();
  }


  private esperarScrollArriba(): Promise<void> {

    return new Promise(resolve => {

      const comprobar = () => {

        if (window.scrollY <= 1) {
          resolve();
          return;
        }

        requestAnimationFrame(comprobar);
      };

      requestAnimationFrame(comprobar);
    });
  }
}