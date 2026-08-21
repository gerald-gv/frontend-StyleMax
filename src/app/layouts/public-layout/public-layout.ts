import { Component, inject } from '@angular/core';
import { Navbar } from "../../shared/components/navbar/navbar";
import { Footer } from "../../shared/components/footer/footer";
import { RouterOutlet } from '@angular/router';
import { BuscadorService } from '../../core/services/buscador.service';

@Component({
  selector: 'app-public-layout',
  imports: [Navbar, RouterOutlet, Footer],
  standalone: true,
  templateUrl: './public-layout.html',
})
export class PublicLayout {

  readonly buscadorService = inject(BuscadorService);

}
