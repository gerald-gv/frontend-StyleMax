import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { AdminCategoriaService } from '../../../../services/admin-categoria.service';
import { ActualizarCategoriaRequest, CategoriaAdmin, CrearCategoriaRequest } from '../../../../models/categoria-admin.model';

@Component({
  selector: 'modal-categoria',
  imports: [],
  templateUrl: './modal-categoria.html',
})
export class ModalCategoria {

  private readonly categoriaService = inject(AdminCategoriaService);

  readonly categoria = input<CategoriaAdmin | null>(null);

  readonly cerrar = output<void>();


  readonly guardado = output<CategoriaAdmin>();
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);


  readonly formulario = signal({ nombre: '', activo: true });
  readonly esEdicion = computed(() => this.categoria() !== null);
  readonly titulo = computed(() => this.esEdicion() ? 'Editar categoría' : 'Nueva categoría');


  constructor() {

    effect(() => {

      const categoria = this.categoria();


      if (categoria) {

        this.formulario.set({
          nombre: categoria.nombre,
          activo: categoria.activo
        });

      }

      else {
        this.limpiarFormulario();
      }

      this.error.set(null);

    });

  }


  actualizarNombre(valor: string): void {

    this.formulario.update(
      formulario => ({
        ...formulario,
        nombre: valor
      })
    );

  }


  actualizarActivo(activo: boolean): void {

    this.formulario.update(
      formulario => ({
        ...formulario,
        activo
      })
    );

  }


  private limpiarFormulario(): void {
    this.formulario.set({
      nombre: '',
      activo: true
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


    const nombre = formulario.nombre.trim();


    if (!nombre) {
      this.error.set(
        'El nombre de la categoría es obligatorio.'
      );
      return;
    }


    const categoriaActual = this.categoria();


    this.guardando.set(true);


    if (categoriaActual) {

      const request: ActualizarCategoriaRequest = {
        nombre,
        activo: formulario.activo
      };


      this.categoriaService.actualizar(categoriaActual.id, request).subscribe({
        next: categoria => {
          this.guardando.set(false);
          this.guardado.emit(categoria);
        },

        error: error => {
          this.guardando.set(false);
          this.error.set(error?.error?.message ?? 'No se pudo actualizar la categoría.');
        }

      });

    }

    else {

      const request: CrearCategoriaRequest = {
        nombre,
        activo: formulario.activo
      };


      this.categoriaService.crear(request).subscribe({
        next: categoria => {
          this.guardando.set(false);
          this.guardado.emit(categoria);
        },

        error: error => {
          this.guardando.set(false);
          this.error.set(error?.error?.message ?? 'No se pudo crear la categoría.');
        }

      });

    }

  }

}