import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilService } from '../../../../core/services/perfil.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DireccionService } from '../../../../core/services/direccion.service';

@Component({
  selector: 'perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {

  private readonly fb = inject(FormBuilder);

  private readonly perfilService = inject(PerfilService);
  private readonly direccionService = inject(DireccionService);
  private readonly authService = inject(AuthService);


  // =========================================================
  // PERFIL
  // =========================================================

  readonly cargando = signal(true);
  readonly guardando = signal(false);

  readonly error = signal(false);
  readonly errorGuardando = signal(false);

  readonly guardado = signal(false);
  readonly editando = signal(false);


  readonly formulario = this.fb.nonNullable.group({

    nombre: ['',[Validators.required]],
    apellido: ['',[Validators.required]],

    correo: [
      {
        value: '',
        disabled: true
      }
    ],

    telefono: ['']
  });


  // =========================================================
  // DIRECCIÓN
  // =========================================================

  readonly cargandoDireccion = signal(true);
  readonly direccionExiste = signal(false);

  readonly errorDireccion = signal(false);
  readonly guardandoDireccion = signal(false);

  readonly direccionGuardada = signal(false);
  readonly editandoDireccion = signal(false);


  readonly formularioDireccion = this.fb.nonNullable.group({

    departamento: [
      '',
      [Validators.required]
    ],

    provincia: [
      '',
      [Validators.required]
    ],

    distrito: [
      '',
      [Validators.required]
    ],

    direccionCompleta: [
      '',
      [Validators.required]
    ],

    referencia: ['']
  });


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.cargarPerfil();

    this.cargarDireccion();
  }


  // =========================================================
  // PERFIL
  // =========================================================

  cargarPerfil(): void {

    this.cargando.set(true);
    this.error.set(false);
    this.errorGuardando.set(false);

    this.perfilService.obtenerPerfil().subscribe({

      next: (perfil) => {

        this.formulario.patchValue({

          nombre: perfil.nombre,
          apellido: perfil.apellido,
          correo: perfil.correo,
          telefono: perfil.telefono ?? ''

        });

        this.formulario.disable();

        this.formulario.controls.correo.disable();

        this.editando.set(false);

        this.cargando.set(false);
      },

      error: (error) => {

        console.error(
          'Error al cargar el perfil:',
          error
        );

        this.error.set(true);

        this.cargando.set(false);
      }
    });
  }


  activarEdicion(): void {

    this.editando.set(true);

    this.errorGuardando.set(false);
    this.guardado.set(false);

    this.formulario.enable();

    this.formulario.controls.correo.disable();
  }


  cancelarEdicion(): void {

    this.editando.set(false);

    this.formulario.disable();

    this.errorGuardando.set(false);

    this.cargarPerfil();
  }


  guardarCambios(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      return;
    }


    this.guardando.set(true);

    this.guardado.set(false);
    this.errorGuardando.set(false);


    const {
      nombre,
      apellido,
      telefono
    } = this.formulario.getRawValue();


    this.perfilService.actualizarPerfil({

      nombre,
      apellido,
      telefono

    }).subscribe({

      next: (perfil) => {

        this.formulario.patchValue({

          nombre: perfil.nombre,
          apellido: perfil.apellido,
          correo: perfil.correo,
          telefono: perfil.telefono ?? ''

        });


        this.authService.actualizarUsuario(perfil);


        this.formulario.disable();

        this.formulario.controls.correo.disable();

        this.editando.set(false);


        this.guardando.set(false);

        this.guardado.set(true);


        setTimeout(() => {

          this.guardado.set(false);

        }, 3000);
      },


      error: (error) => {

        console.error(
          'Error al actualizar el perfil:',
          error
        );

        this.guardando.set(false);

        this.errorGuardando.set(true);
      }
    });
  }


  // =========================================================
  // DIRECCIÓN
  // =========================================================

  cargarDireccion(): void {

    this.cargandoDireccion.set(true);

    this.errorDireccion.set(false);

    this.direccionExiste.set(false);


    this.direccionService.obtenerDireccion().subscribe({

      next: (direccion) => {

        this.formularioDireccion.patchValue({

          departamento: direccion.departamento,
          provincia: direccion.provincia,
          distrito: direccion.distrito,
          direccionCompleta: direccion.direccionCompleta,
          referencia: direccion.referencia ?? ''

        });


        this.formularioDireccion.disable();

        this.editandoDireccion.set(false);

        this.direccionExiste.set(true);

        this.cargandoDireccion.set(false);
      },


      error: (error) => {

        console.error(
          'Error al cargar la dirección:',
          error
        );


        /*
         * 404 significa que el usuario todavía
         * no tiene una dirección registrada.
         */
        if (error.status === 404) {

          this.direccionExiste.set(false);

          this.formularioDireccion.reset();

          this.formularioDireccion.disable();

          this.editandoDireccion.set(false);

          this.errorDireccion.set(false);

        } else {

          this.errorDireccion.set(true);
        }


        this.cargandoDireccion.set(false);
      }
    });
  }


  activarEdicionDireccion(): void {

    this.editandoDireccion.set(true);

    this.direccionGuardada.set(false);

    this.errorDireccion.set(false);

    this.formularioDireccion.enable();
  }


  cancelarEdicionDireccion(): void {

    this.editandoDireccion.set(false);

    this.formularioDireccion.disable();

    this.direccionGuardada.set(false);

    this.cargarDireccion();
  }


  guardarDireccion(): void {

    if (this.formularioDireccion.invalid) {

      this.formularioDireccion.markAllAsTouched();

      return;
    }


    this.guardandoDireccion.set(true);

    this.direccionGuardada.set(false);

    this.errorDireccion.set(false);


    const {
      departamento,
      provincia,
      distrito,
      direccionCompleta,
      referencia
    } = this.formularioDireccion.getRawValue();


    this.direccionService.guardarDireccion({

      departamento,
      provincia,
      distrito,
      direccionCompleta,
      referencia

    }).subscribe({

      next: (direccion) => {

        this.formularioDireccion.patchValue({

          departamento: direccion.departamento,
          provincia: direccion.provincia,
          distrito: direccion.distrito,
          direccionCompleta: direccion.direccionCompleta,
          referencia: direccion.referencia ?? ''

        });


        this.formularioDireccion.disable();

        this.editandoDireccion.set(false);

        this.direccionExiste.set(true);

        this.guardandoDireccion.set(false);

        this.direccionGuardada.set(true);


        setTimeout(() => {

          this.direccionGuardada.set(false);

        }, 3000);
      },


      error: (error) => {

        console.error(
          'Error al guardar la dirección:',
          error
        );

        this.guardandoDireccion.set(false);

        this.errorDireccion.set(true);
      }
    });
  }
}