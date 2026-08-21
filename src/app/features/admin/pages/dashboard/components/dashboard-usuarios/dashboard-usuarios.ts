import { Component, input } from "@angular/core";
import { UsuarioEstadisticas } from "../../../../models/usuario-estadisticas.model";

@Component({
    selector: 'dashboard-usuarios',
    imports: [],
    templateUrl: './dashboard-usuarios.html'
})
export class DashboardUsuarios {

    readonly cargando = input(false);

    readonly usuarios = input<UsuarioEstadisticas | null>(null);


    porcentaje(valor: number, total: number): number {

        if (total <= 0) {
            return 0;
        }

        return Math.round((valor / total) * 100);
    }


    porcentajeUsuariosActivos(): number {

        const usuarios = this.usuarios();

        if (!usuarios) {
            return 0;
        }

        return this.porcentaje(
            usuarios.usuariosActivos,
            usuarios.totalUsuarios
        );
    }

}