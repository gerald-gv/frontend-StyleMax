import { Component, inject, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";

@Component({
  selector: 'admin-header',
  imports: [RouterLink],
  templateUrl: './admin-header.html',
})
export class AdminHeaderComponent {

    private readonly authService = inject(AuthService);
    readonly usuario = this.authService.usuario;
    
    readonly toggleMenu = output<void>();
    readonly solicitarCierreSesion = output<void>();

}