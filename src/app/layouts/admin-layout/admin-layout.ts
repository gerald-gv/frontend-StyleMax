import { Component, inject, signal } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { AdminHeaderComponent } from "./components/admin-header/admin-header";
import { AdminSidebarComponent } from "./components/admin-sidebar/admin-sidebar";

@Component({
    selector: 'admin-layout',
    imports: [RouterOutlet, AdminHeaderComponent, AdminSidebarComponent],
    templateUrl: './admin-layout.html'
})
export class AdminLayout {

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly usuario = this.authService.usuario;

    readonly menuAbierto = signal(false);

    cerrarMenu(): void {
        this.menuAbierto.set(false);
    }

    toggleMenu(): void {
        this.menuAbierto.update(abierto => !abierto);
    }

    cerrarSesion(): void {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}