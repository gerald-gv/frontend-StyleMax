import { CarritoItem } from "./carritoItem.model";

export interface Carrito {
    id: number;
    total: number;
    items: CarritoItem[];
}