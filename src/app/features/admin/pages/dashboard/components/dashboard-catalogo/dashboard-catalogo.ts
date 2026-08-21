import { Component, input } from "@angular/core";
import { ProductoEstadisticas } from "../../../../models/producto-estadisticas.model";
import { CategoriaEstadisticas } from "../../../../models/categoria-admin.model";
import { MarcaEstadisticas } from "../../../../models/marca-estadisticas.model";

@Component({
    selector: 'dashboard-catalogo',
    imports: [],
    templateUrl: './dashboard-catalogo.html'
})
export class DashboardCatalogo {

    // INPUTS

    readonly cargando = input(false);
    readonly productos = input<ProductoEstadisticas | null>(null);
    readonly categorias = input<CategoriaEstadisticas | null>(null);
    readonly marcas = input<MarcaEstadisticas | null>(null);

    // PORCENTAJES

    porcentaje(
        valor: number,
        total: number
    ): number {

        if (total <= 0) {
            return 0;
        }

        return Math.round(
            (valor / total) * 100
        );
    }


    porcentajeProductosActivos(): number {

        const productos = this.productos();

        if (!productos) {
            return 0;
        }

        return this.porcentaje(
            productos.activos,
            productos.total
        );
    }


    porcentajeCategoriasActivas(): number {

        const categorias = this.categorias();

        if (!categorias) {
            return 0;
        }

        return this.porcentaje(
            categorias.activas,
            categorias.total
        );
    }


    porcentajeMarcasActivas(): number {

        const marcas = this.marcas();

        if (!marcas) {
            return 0;
        }

        return this.porcentaje(
            marcas.activas,
            marcas.total
        );
    }
}