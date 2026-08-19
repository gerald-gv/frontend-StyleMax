import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { AdminUsuarioService } from '../../../../services/admin-usuario.service';
import { ActualizarUsuarioRequest, RestablecerPasswordRequest, UsuarioAdmin } from '../../../../models/usuario-admin.model';

@Component({
  selector: 'modal-usuario',
  imports: [],
  templateUrl: './modal-usuario.html',
})
export class ModalUsuario {

  private readonly usuarioService = inject(AdminUsuarioService);


  // USUARIO

  readonly usuario = input<UsuarioAdmin | null>(null);


  // EVENTOS

  readonly cerrar =  output<void>();

  readonly guardado = output<UsuarioAdmin>();


  // ESTADO

  readonly guardando = signal(false);

  readonly restableciendoPassword = signal(false);

  readonly activando =  signal(false);

  readonly error = signal<string | null>(null);

  readonly errorPassword = signal<string | null>(null);


  // FORMULARIO

  readonly formulario =
    signal({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: ''
    });


  // PASSWORD

  readonly nuevaPassword = signal('');
  readonly confirmarPassword = signal('');


  // COMPUTED

  readonly esAdministrador = computed(() => this.usuario()?.rol === 'ADMINISTRADOR' );


  readonly esCliente = computed(() => this.usuario()?.rol === 'CLIENTE' );


  readonly titulo = computed(() => this.usuario() ? 'Editar usuario' : 'Usuario' );


  constructor() {

    effect(() => {

      const usuario = this.usuario();


      if (usuario) {

        this.formulario.set({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          telefono: usuario.telefono ?? ''
        });

      } else {

        this.limpiarFormulario();

      }


      this.nuevaPassword.set('');
      this.confirmarPassword.set('');

      this.error.set(null);
      this.errorPassword.set(null);

      this.activando.set(false);

    });

  }


  // FORMULARIO

  actualizarCampo(
    campo: keyof ReturnType<typeof this.formulario >, valor: string ): void {

    this.formulario.update(
      formulario => ({
        ...formulario,
        [campo]: valor

      })
    );

  }


  actualizarPassword( valor: string ): void {
    this.nuevaPassword.set(valor);
  }


  actualizarConfirmacionPassword( valor: string ): void {
    this.confirmarPassword.set(valor);
  }


  // LIMPIAR

  private limpiarFormulario(): void {

    this.formulario.set({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: ''
    });

  }


  // CERRAR

  cerrarModal(): void {

    if (
      this.guardando() ||
      this.restableciendoPassword() ||
      this.activando()
    ) {

      return;

    }

    this.cerrar.emit();

  }


  // GUARDAR DATOS

  guardar(): void {

    if ( this.guardando() || this.restableciendoPassword() ) {

      return;

    }


    const usuario = this.usuario();

    if (!usuario) {
      return;
    }


    this.error.set(null);


    const formulario = this.formulario();
    const error = this.validarFormulario(formulario);


    if (error) {

      this.error.set(error);

      return;

    }


    const request: ActualizarUsuarioRequest = {

      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      correo: formulario.correo.trim(),
      telefono: formulario.telefono.trim() || null

    };


    this.guardando.set(true);


    this.usuarioService
      .actualizar( usuario.id, request ) .subscribe({

        next: usuarioActualizado => {

          this.guardando.set(false);
          this.guardado.emit( usuarioActualizado );

        },

        error: error => {

          this.guardando.set(false);
          this.error.set(
            error?.error?.message ??
            'No se pudo actualizar el usuario.'

          );

        }

      });

  }


  activarUsuario(): void {

    if (
      this.activando() ||
      this.guardando() ||
      this.restableciendoPassword()
    ) {
      return;
    }


    const usuario = this.usuario();


    if (!usuario) {
      return;
    }


    if (!this.esCliente()) {

      this.error.set( 'Solo se pueden reactivar usuarios clientes.' );

      return;

    }


    if (usuario.activo) {

      return;

    }


    this.error.set(null);

    this.activando.set(true);


    this.usuarioService
      .activar(usuario.id)
      .subscribe({

        next: usuarioActivado => {

          this.activando.set(false);
          this.guardado.emit( usuarioActivado );

        },

        error: error => {

          this.activando.set(false);
          this.error.set(error?.error?.message ??'No se pudo activar el usuario.');

        }

      });

  }


  // RESTABLECER PASSWORD

  restablecerPassword(): void {

    if ( this.restableciendoPassword() || this.guardando() ) {
      return;
    }


    const usuario = this.usuario();


    if (!usuario) {
      return;
    }

    if (this.esAdministrador()) {

      this.errorPassword.set('No puedes cambiar la contraseña de otro administrador.');
      return;

    }


    this.errorPassword.set(null);


    const password = this.nuevaPassword().trim();
    const confirmacion = this.confirmarPassword().trim();


    if (!password) {
      this.errorPassword.set( 'La nueva contraseña es obligatoria.' );
      return;

    }


    if (password.length < 8) {
      this.errorPassword.set( 'La contraseña debe tener al menos 8 caracteres.' );
      return;

    }


    if (password !== confirmacion) {
      this.errorPassword.set( 'Las contraseñas no coinciden.' );
      return;

    }


    const request: RestablecerPasswordRequest = {
      nuevaPassword: password
    };


    this.restableciendoPassword.set(true);


    this.usuarioService .restablecerPassword( usuario.id, request )
      .subscribe({

        next: () => {

          this.restableciendoPassword.set(false);
          this.nuevaPassword.set('');
          this.confirmarPassword.set('');

        },

        error: error => {

          this.restableciendoPassword.set(false);
          this.errorPassword.set(error?.error?.message ??'No se pudo restablecer la contraseña.');

        }

      });

  }


  // VALIDACION

  private validarFormulario( formulario: ReturnType< typeof this.formulario > ): string | null {

    if (!formulario.nombre.trim()) {
      return 'El nombre es obligatorio.';
    }


    if (formulario.nombre.trim().length > 100) {
      return 'El nombre no puede superar los 100 caracteres.';
    }


    if (!formulario.apellido.trim()) {
      return 'El apellido es obligatorio.';
    }


    if (formulario.apellido.trim().length > 100) {
      return 'El apellido no puede superar los 100 caracteres.';
    }


    if (!formulario.correo.trim()) {
      return 'El correo es obligatorio.';
    }


    if (formulario.correo.trim().length > 150) {
      return 'El correo no puede superar los 150 caracteres.';
    }


    if (!this.correoValido(formulario.correo)) {
      return 'Ingresa un correo electrónico válido.';
    }


    if (formulario.telefono.trim().length > 20) {
      return 'El teléfono no puede superar los 20 caracteres.';
    }


    return null;

  }


  private correoValido( correo: string ): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/ .test(correo.trim());
  }

}
