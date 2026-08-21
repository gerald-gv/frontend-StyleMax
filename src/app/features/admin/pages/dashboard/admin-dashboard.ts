import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminProductoService } from '../../services/admin-producto.service';
import { AdminCategoriaService } from '../../services/admin-categoria.service';
import { AdminMarcaService } from '../../services/admin-marca.service';
import { AdminPedidoService } from '../../services/admin-pedido.service';
import { AdminUsuarioService } from '../../services/admin-usuario.service';
import { ProductoEstadisticas } from '../../models/producto-estadisticas.model';
import { CategoriaEstadisticas } from '../../models/categoria-admin.model';
import { MarcaEstadisticas } from '../../models/marca-estadisticas.model';
import { PedidoEstadisticas } from '../../models/pedido-estadisticas.model';
import { UsuarioEstadisticas } from '../../models/usuario-estadisticas.model';
import { forkJoin } from 'rxjs';
import { DashboardCatalogo } from './components/dashboard-catalogo/dashboard-catalogo';
import { DashboardUsuarios } from './components/dashboard-usuarios/dashboard-usuarios';
import { DashboardPedidos } from './components/dashboard-pedidos/dashboard-pedidos';

@Component({
    selector: 'admin-dashboard',
    imports: [DashboardCatalogo, DashboardUsuarios, DashboardPedidos],
    templateUrl: './admin-dashboard.html'
})
export class AdminDashboard implements OnInit {

    private readonly productoService = inject(AdminProductoService);
    private readonly categoriaService = inject(AdminCategoriaService);
    private readonly marcaService = inject(AdminMarcaService);
    private readonly pedidoService = inject(AdminPedidoService);
    private readonly usuarioService = inject(AdminUsuarioService);


    // ESTADO

    readonly cargando = signal(true);
    readonly error = signal<string | null>(null);


    // ESTADISTICAS

    readonly productos = signal<ProductoEstadisticas | null>(null);
    readonly categorias = signal<CategoriaEstadisticas | null>(null);
    readonly marcas = signal<MarcaEstadisticas | null>(null);
    readonly pedidos = signal<PedidoEstadisticas | null>(null);
    readonly usuarios = signal<UsuarioEstadisticas | null>(null);


    // CICLO DE VIDA

    ngOnInit(): void {
        this.cargarEstadisticas();
    }


    // CARGAR ESTADISTICAS

    cargarEstadisticas(): void {

        this.cargando.set(true);
        this.error.set(null);

        forkJoin({

            productos: this.productoService.obtenerEstadisticas(),

            categorias: this.categoriaService.obtenerEstadisticas(),

            marcas: this.marcaService.obtenerEstadisticas(),

            pedidos: this.pedidoService.obtenerEstadisticas(),

            usuarios: this.usuarioService.obtenerEstadisticas()

        }).subscribe({

            next: respuesta => {
                this.productos.set(respuesta.productos);
                this.categorias.set(respuesta.categorias);
                this.marcas.set(respuesta.marcas);
                this.pedidos.set(respuesta.pedidos);
                this.usuarios.set(respuesta.usuarios);
                this.cargando.set(false);
            },

            error: error => {

                console.error(
                    'No se pudieron cargar las estadísticas del dashboard:',
                    error
                );

                this.error.set(
                    'No se pudieron cargar las estadísticas del dashboard.'
                );

                this.cargando.set(false);
            }

        });
    }


    // ============================================================
    // KPIs
    // ============================================================

    totalPedidos(): number {

        const pedidos = this.pedidos();

        if (!pedidos) {
            return 0;
        }

        return pedidos.pendientes
            + pedidos.pagados
            + pedidos.empaquetando
            + pedidos.enviando
            + pedidos.entregados
            + pedidos.cancelados;
    }
}