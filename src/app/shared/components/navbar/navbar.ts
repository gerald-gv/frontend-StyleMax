import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchBar } from '../search-bar/search-bar';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, SearchBar],
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

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
