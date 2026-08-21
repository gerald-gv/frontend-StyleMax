import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SearchBar } from '../search-bar/search-bar';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SearchBar],
  templateUrl: './navbar.html',
})
export class Navbar {

  private readonly authService = inject(AuthService);
  private readonly carritoService = inject(CarritoService);
  private readonly router = inject(Router);

  readonly usuario = this.authService.usuario;
  readonly autenticado = this.authService.autenticado;
  readonly cantidadItems = this.carritoService.cantidadItems;

  isMenuOpen = signal(false);
  mostrarDropdown = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  toggleDropdown(): void {
    this.mostrarDropdown.update(value => !value);
  }

  cuentaActiva(): boolean {
    return this.router.isActive('/perfil', {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    }) || this.router.isActive('/pedidos', {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }


  cerrarSesion(): void {
    this.mostrarDropdown.set(false);
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
