import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { AdminProductoService } from '../../../../services/admin-producto.service';
import { ActualizarProductoRequest, CrearProductoRequest, FormularioProducto, ProductoAdmin } from '../../../../models/producto-admin.model';
import { Marca } from '../../../../../../core/models/marca.model';
import { Categoria } from '../../../../../../core/models/categoria.model';
import { FormsModule } from '@angular/forms';

export interface OpcionProducto {
  id: number;
  nombre: string;
}



@Component({
  selector: 'modal-producto',
  imports: [FormsModule],
  templateUrl: './modal-producto.html',
})
export class ModalProducto {

  private readonly productoService = inject(AdminProductoService);

  readonly producto = input<ProductoAdmin | null>(null);

  readonly marcas = input<Marca[]>([]);
  readonly categorias = input<Categoria[]>([]);
  readonly fits = input<string[]>([]);

  readonly cerrar = output<void>();
  readonly guardado = output<ProductoAdmin>();

  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  readonly formulario = signal<FormularioProducto>({
    nombre: '',
    descripcion: '',
    precio: null,
    stock: 0,
    color: '',
    fit: '',
    imagen: '',
    destacado: false,
    activo: true,
    marcaId: null,
    categoriaId: null
  });

  readonly slugPreview = computed(() => {

    const producto = this.producto();

    if (producto) {
      return producto.slug;
    }

    return this.generarSlugPreview(this.formulario().nombre);
  });

  readonly esEdicion = computed(() => this.producto() !== null);

  readonly titulo = computed(() =>
    this.esEdicion()
      ? 'Editar producto'
      : 'Nuevo producto'
  );


  private generarSlugPreview(nombre: string): string {

    return nombre
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  constructor() {

    effect(() => {

      const producto = this.producto();

      if (producto) {

        this.formulario.set({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          color: producto.color,
          fit: producto.fit,
          imagen: producto.imagen,
          destacado: producto.destacado,
          activo: producto.activo,
          marcaId: producto.marcaId,
          categoriaId: producto.categoriaId
        });

      } else {

        this.limpiarFormulario();

      }

      this.error.set(null);

    });

  }

  actualizarCampo<K extends keyof FormularioProducto>(
    campo: K,
    valor: FormularioProducto[K]
  ): void {

    this.formulario.update(formulario => ({
      ...formulario,
      [campo]: valor
    }));

  }

  private limpiarFormulario(): void {

    this.formulario.set({
      nombre: '',
      descripcion: '',
      precio: null,
      stock: 0,
      color: '',
      fit: '',
      imagen: '',
      destacado: false,
      activo: true,
      marcaId: null,
      categoriaId: null
    });

  }

  cerrarModal(): void {
    if (this.guardando()) {
      return;
    }

    this.cerrar.emit();
  }

  guardar(): void {

    if (this.guardando()) {
      return;
    }

    this.error.set(null);

    const formulario = this.formulario();

    // Validaciones basicas
    const error = this.validarFormulario(formulario)

    if (error) {
        this.error.set(error);
        return;
    }


    const request: CrearProductoRequest = {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      precio: formulario.precio!,
      stock: formulario.stock,
      color: formulario.color.trim(),
      fit: formulario.fit,
      imagen: formulario.imagen.trim(),
      destacado: formulario.destacado,
      activo: formulario.activo,
      marcaId: formulario.marcaId!,
      categoriaId: formulario.categoriaId!
    };


    this.guardando.set(true);


    const productoActual = this.producto();


    const peticion = productoActual

      ? this.productoService.actualizar(
        productoActual.id,
        request as ActualizarProductoRequest
      )

      : this.productoService.crear(request);


    peticion.subscribe({

      next: producto => {

        this.guardando.set(false);

        this.guardado.emit(producto);

      },

      error: error => {

        this.guardando.set(false);

        this.error.set(
          error?.error?.message ??
          'No se pudo guardar el producto.'
        );

      }

    });

  }


  private validarFormulario(formulario: FormularioProducto): string | null {

    if (!formulario.nombre.trim()) {
      return 'El nombre del producto es obligatorio.';
    }

    if (!formulario.descripcion.trim()) {
      return 'La descripción es obligatoria.';
    }

    if (!formulario.precio || formulario.precio <= 0) {
      return 'El precio debe ser mayor a 0.';
    }

    if (formulario.stock < 0) {
      return 'El stock no puede ser negativo.';
    }

    if (!formulario.color.trim()) {
      return 'El color es obligatorio.';
    }

    if (!formulario.fit) {
      return 'Debes seleccionar un fit.';
    }

    if (!formulario.imagen.trim()) {
      return 'La URL de imagen es obligatoria.';
    }

    if (!formulario.marcaId) {
      return 'Debes seleccionar una marca.';
    }

    if (!formulario.categoriaId) {
      return 'Debes seleccionar una categoría.';
    }

    return null;
  }
}