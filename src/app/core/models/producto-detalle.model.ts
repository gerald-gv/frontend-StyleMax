import { Categoria } from "./categoria.model";
import { Marca } from "./marca.model";

export interface ProductoDetalle {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  stock: number;
  color: string;
  fit: string;
  imagen: string;
  destacado: boolean;
  marca: Marca;
  categoria: Categoria;
}