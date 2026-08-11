import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../../../core/services/producto.service';
import { ProductoDetalle } from '../../../../core/models/producto-detalle.model';

type Estado = 'loading' | 'error' | 'success';

@Component({
  selector: 'producto-detalle',
  imports: [RouterLink],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetallePage implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly productoService = inject(ProductoService);

  producto = signal<ProductoDetalle | null>(null)

  estado = signal<Estado>('loading')
  
  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')

    if(!slug){
      this.estado.set('error')
      return
    }

    this.cargarProducto(slug)
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


}
