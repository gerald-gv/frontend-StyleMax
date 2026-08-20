import { afterNextRender, Component, computed, effect, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ProductoService } from '../../../../core/services/producto.service';
import { RouterLink } from '@angular/router';
import { Producto } from '../../../../core/models/producto.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'productos-destacados',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './productos-destacados.html',
})
export class ProductosDestacados implements OnInit {

  private readonly productoService = inject(ProductoService);

  @ViewChild('slider')
  slider!: ElementRef<HTMLDivElement>;


  // =========================================================
  // Estado
  // =========================================================

  productos = signal<Producto[]>([]);

  paginaActual = signal(0);

  productosPorPagina = signal(4);


  // =========================================================
  // Total de páginas
  // =========================================================

  totalPaginas = computed(() => {

    const totalProductos = this.productos().length;

    const porPagina = this.productosPorPagina();

    if (totalProductos === 0) {
      return 0;
    }

    return Math.ceil(
      totalProductos / porPagina
    );

  });


  // =========================================================
  // Array para los tabs
  // =========================================================

  paginas = computed(() =>
    Array.from({
      length: this.totalPaginas()
    })
  );


  // =========================================================
  // Inicialización
  // =========================================================

  ngOnInit(): void {

    this.productoService.listarDestacados()
      .subscribe({

        next: (productos) => {

          this.productos.set(productos);

          // En desktop inicialmente mostramos 4
          this.actualizarProductosPorPagina();

        },

        error: (error) => {

          console.error(
            'Error cargando productos destacados',
            error
          );

        }

      });

  }



  // =========================================================
  // Responsive
  // =========================================================


  @HostListener('window:resize')
  onResize(): void {

    const paginaAnterior = this.paginaActual();

    this.actualizarProductosPorPagina();

    const total = this.totalPaginas();

    if (paginaAnterior >= total) {

      this.paginaActual.set(
        Math.max(total - 1, 0)
      );

    }

  }

  private actualizarProductosPorPagina(): void {

    const ancho = window.innerWidth;

    if (ancho >= 1024) {

      // lg → 4 productos
      this.productosPorPagina.set(4);

    } else if (ancho >= 768) {

      // md → 3 productos
      this.productosPorPagina.set(3);

    } else {

      // móvil → 2 productos
      this.productosPorPagina.set(2);

    }

  }


  // =========================================================
  // Slider
  // =========================================================

  mover(direccion: 'prev' | 'next'): void {

    const elemento = this.slider?.nativeElement;

    if (!elemento) {
      return;
    }


    const total = this.totalPaginas();

    if (total <= 1) {
      return;
    }


    const paginaActual = this.paginaActual();


    const nuevaPagina =
      direccion === 'next'
        ? paginaActual + 1
        : paginaActual - 1;


    const pagina = Math.max(
      0,
      Math.min(
        nuevaPagina,
        total - 1
      )
    );


    this.paginaActual.set(pagina);


    elemento.scrollTo({

      left: pagina * elemento.clientWidth,

      behavior: 'smooth'

    });

  }


  // =========================================================
  // Ir directamente a una página
  // =========================================================

  irAPagina(pagina: number): void {

    const elemento = this.slider?.nativeElement;

    if (!elemento) {
      return;
    }


    const total = this.totalPaginas();

    if (pagina < 0 || pagina >= total) {
      return;
    }


    this.paginaActual.set(pagina);


    elemento.scrollTo({

      left: pagina * elemento.clientWidth,

      behavior: 'smooth'

    });

  }

}