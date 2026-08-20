import { Component } from '@angular/core';
import { Hero } from "../../components/hero/hero";
import { CategoriasClasicas } from "../../components/categorias-clasicas/categorias-clasicas";
import { ProductosDestacados } from "../../components/productos-destacados/productos-destacados";

@Component({
  selector: 'home',
  imports: [Hero, CategoriasClasicas, ProductosDestacados],
  templateUrl: './home.html',
})
export class Home {}
