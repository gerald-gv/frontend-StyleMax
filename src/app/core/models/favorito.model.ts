import { Producto } from "./producto.model";

export interface Favorito {

  productoId: number;
  fechaAgregado: string;
  producto: Producto;

}