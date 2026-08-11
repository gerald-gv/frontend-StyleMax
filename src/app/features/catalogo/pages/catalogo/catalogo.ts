import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { ProductoService } from '../../../../core/services/producto.service';
import { Producto } from '../../../../core/models/producto.model';
import { ProductoCard } from '../../../../shared/components/producto-card/producto-card';

@Component({
  selector: 'catalogo',
  imports: [ProductoCard],
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit {

  private readonly productoService = inject(ProductoService);

  productos = signal<Producto[]>([]);

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.productoService.listarCatalogo().subscribe({
      next: (productos) => {
        //console.log('Productos cargados:', productos);
        this.productos.set(productos);
      },
      error: (error) => {
        console.error('Error al cargar los productos:', error);
      }
    });
  }
}
