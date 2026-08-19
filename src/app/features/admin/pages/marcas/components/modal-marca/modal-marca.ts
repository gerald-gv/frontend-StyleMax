import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ActualizarMarcaRequest, CrearMarcaRequest, FormularioMarca, MarcaAdmin } from '../../../../models/marca-admin.model';
import { AdminMarcaService } from '../../../../services/admin-marca.service';

@Component({
  selector: 'modal-marca',
  imports: [],
  templateUrl: './modal-marca.html',
})
export class ModalMarca {

    private readonly marcaService = inject(AdminMarcaService);


    readonly marca = input<MarcaAdmin | null>(null);


    readonly cerrar = output<void>();

    readonly guardado = output<MarcaAdmin>();


    readonly guardando = signal(false);

    readonly error = signal<string | null>(null);


    readonly formulario = signal<FormularioMarca>({
        nombre: '',
        activo: true
    });


    readonly esEdicion = computed(() =>
        this.marca() !== null
    );


    readonly titulo = computed(() =>
        this.esEdicion()
            ? 'Editar marca'
            : 'Nueva marca'
    );


    constructor() {

        effect(() => {

            const marca = this.marca();

            if (marca) {

                this.formulario.set({
                    nombre: marca.nombre,
                    activo: marca.activo
                });

            } else {

                this.limpiarFormulario();

            }

            this.error.set(null);

        });

    }


    actualizarCampo<K extends keyof FormularioMarca>(
        campo: K,
        valor: FormularioMarca[K]
    ): void {

        this.formulario.update(formulario => ({
            ...formulario,
            [campo]: valor
        }));

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


        const error = this.validarFormulario(formulario);

        if (error) {

            this.error.set(error);

            return;
        }


        const marcaActual = this.marca();


        this.guardando.set(true);


        if (marcaActual) {

            const request: ActualizarMarcaRequest = {
                nombre: formulario.nombre.trim(),
                activo: formulario.activo
            };


            this.marcaService.actualizar(
                marcaActual.id,
                request
            ).subscribe({

                next: marca => {

                    this.guardando.set(false);

                    this.guardado.emit(marca);

                },

                error: error => {

                    this.guardando.set(false);

                    this.error.set(
                        error?.error?.message ??
                        'No se pudo actualizar la marca.'
                    );

                }

            });

        } else {

            const request: CrearMarcaRequest = {
                nombre: formulario.nombre.trim(),
                activo: formulario.activo
            };


            this.marcaService.crear(request)
                .subscribe({

                    next: marca => {

                        this.guardando.set(false);

                        this.guardado.emit(marca);

                    },

                    error: error => {

                        this.guardando.set(false);

                        this.error.set(
                            error?.error?.message ??
                            'No se pudo crear la marca.'
                        );

                    }

                });

        }

    }


    private validarFormulario(
        formulario: FormularioMarca
    ): string | null {

        if (!formulario.nombre.trim()) {

            return 'El nombre de la marca es obligatorio.';

        }


        if (formulario.nombre.trim().length > 100) {

            return 'El nombre de la marca no puede superar los 100 caracteres.';

        }


        return null;

    }

}
