import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'admin-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebarComponent {

  readonly menuAbierto = input(false);

  readonly cerrarMenu = output<void>();

  readonly solicitarCierreSesion = output<void>();

}
