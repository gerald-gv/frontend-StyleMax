import { Producto } from './producto.model';

export interface CatalogoResponse {
    contenido: Producto[];
    pagina: number;
    tamanio: number;
    totalElementos: number;
    totalPaginas: number;
    ultima: boolean;
}