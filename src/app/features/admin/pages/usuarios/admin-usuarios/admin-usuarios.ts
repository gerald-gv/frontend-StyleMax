import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AdminUsuarioService } from '../../../services/admin-usuario.service';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap } from 'rxjs';
import { UsuarioAdmin } from '../../../models/usuario-admin.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalUsuario } from '../components/modal-usuario/modal-usuario';

@Component({
  selector: 'admin-usuarios',
  imports: [ModalUsuario],
  templateUrl: './admin-usuarios.html',
})
export class AdminUsuarios implements OnInit {

  private readonly usuarioService = inject(AdminUsuarioService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly terminoBusqueda$ = new Subject<string>();


  // USUARIOS

  readonly usuarios = signal<UsuarioAdmin[]>([]);


  // ESTADO

  readonly cargando = signal(true);

  readonly cambiandoPagina = signal(false);

  readonly buscando = signal(false);

  readonly error = signal<string | null>(null);


  // BUSQUEDA

  readonly busqueda = signal('');


  // FILTRO ROL

  readonly rolSeleccionado = signal('');


  // PAGINACION

  readonly paginaActual = signal(0);

  readonly tamanioPagina = signal(0);

  readonly totalElementos = signal(0);

  readonly totalPaginas = signal(0);


  // ESTADISTICAS

  readonly totalUsuarios = signal(0);

  readonly administradores = signal(0);

  readonly clientes = signal(0);

  readonly usuariosActivos = signal(0);

  readonly usuariosInactivos = signal(0);


  // MODAL USUARIO

  readonly modalUsuarioAbierto = signal(false);

  readonly usuarioSeleccionado = signal<UsuarioAdmin | null>(null);



  ngOnInit(): void {

    this.cargarUsuarios();
    this.cargarEstadisticas();


    this.terminoBusqueda$
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),

        switchMap(valor => {

          this.buscando.set(true);
          this.error.set(null);

          return this.usuarioService.listar(0, this.rolSeleccionado(), valor).pipe(

            catchError(() => {

              this.error.set(
                'No se pudieron cargar los usuarios.'
              );

              this.buscando.set(false);

              return EMPTY;

            })

          );

        }),

        takeUntilDestroyed(this.destroyRef)

      )
      .subscribe(response => {

        this.usuarios.set(response.contenido);

        this.paginaActual.set(response.pagina);

        this.tamanioPagina.set(response.tamanio);

        this.totalElementos.set(response.totalElementos);

        this.totalPaginas.set(response.totalPaginas);

        this.buscando.set(false);
        this.cambiandoPagina.set(false);

      });

  }


  // PAGINACION

  protected ultimoElemento(): number {
    return Math.min((this.paginaActual() + 1) * this.tamanioPagina(), this.totalElementos());
  }


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
    this.cargarUsuarios(pagina);

  }


  paginaAnterior(): void {
    this.irAPagina(this.paginaActual() - 1);
  }


  paginaSiguiente(): void {
    this.irAPagina(this.paginaActual() + 1);
  }


  // USUARIOS

  cargarUsuarios(pagina: number = 0): void {

    this.cargando.set(pagina === 0);

    this.error.set(null);

    this.usuarioService.listar(
      pagina,
      this.rolSeleccionado(),
      this.busqueda()
    ).subscribe({

      next: response => {

        this.usuarios.set(response.contenido);

        this.paginaActual.set(response.pagina);

        this.tamanioPagina.set(response.tamanio);

        this.totalElementos.set(response.totalElementos);

        this.totalPaginas.set(response.totalPaginas);

        this.cargando.set(false);
        this.cambiandoPagina.set(false);

      },

      error: () => {

        this.error.set(
          'No se pudieron cargar los usuarios.'
        );

        this.cargando.set(false);
        this.cambiandoPagina.set(false);

      }

    });

  }


  // ESTADISTICAS

  cargarEstadisticas(): void {

    this.usuarioService
      .obtenerEstadisticas()
      .subscribe({

        next: estadisticas => {

          this.totalUsuarios.set(estadisticas.totalUsuarios);

          this.administradores.set(estadisticas.administradores);

          this.clientes.set(estadisticas.clientes);

          this.usuariosActivos.set(estadisticas.usuariosActivos);

          this.usuariosInactivos.set(estadisticas.usuariosInactivos);

        },

        error: () => {
          this.error.set('No se pudieron cargar las estadísticas de usuarios.');
        }

      });

  }


  // BUSQUEDA

  actualizarBusqueda(valor: string): void {
    this.busqueda.set(valor);
    this.terminoBusqueda$.next(valor);
  }


  // FILTRO ROL

  cambiarRol(rol: string): void {
    this.rolSeleccionado.set(rol);
    this.cargarUsuarios(0);
  }

  usuarioGuardado(usuario: UsuarioAdmin): void {

    this.usuarios.update(
      usuarios => usuarios.map(u => u.id === usuario.id ? usuario : u)
    );

    this.modalUsuarioAbierto.set(false);
    this.usuarioSeleccionado.set(null);
    this.cargarEstadisticas();

  }

  editarUsuario(usuario: UsuarioAdmin): void {

    this.usuarioService
      .obtener(usuario.id)
      .subscribe({

        next: usuarioCompleto => {

          this.usuarioSeleccionado.set(usuarioCompleto);
          this.modalUsuarioAbierto.set(true);

        },

        error: () => {

          this.error.set('No se pudo cargar la información del usuario.');

        }

      });

  }

  cerrarModalUsuario(): void {
    this.modalUsuarioAbierto.set(false);
    this.usuarioSeleccionado.set(null);
  }

  // HELPERS

  esAdministrador(usuario: UsuarioAdmin): boolean {
    return usuario.rol === 'ADMINISTRADOR';
  }


  esCliente(usuario: UsuarioAdmin): boolean {
    return usuario.rol === 'CLIENTE';
  }


  // DESACTIVAR

  eliminarUsuario(usuario: UsuarioAdmin): void {

    if (usuario.rol === 'ADMINISTRADOR') {

      return;

    }

    const confirmado = window.confirm(`¿Deseas desactivar al usuario "${usuario.nombre} ${usuario.apellido}"?`
    );

    if (!confirmado) {
      return;
    }


    this.usuarioService
      .eliminar(usuario.id)
      .subscribe({

        next: () => {

          this.usuarios.update(usuarios => usuarios.map(u => u.id === usuario.id ? { ...u, activo: false } : u));
          this.cargarEstadisticas();
        },

        error: () => {

          this.error.set('No se pudo desactivar el usuario.');

        }

      });

  }

}
