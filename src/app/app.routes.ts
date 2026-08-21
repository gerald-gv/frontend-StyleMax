import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Home } from './features/home/pages/home/home';
import { Catalogo } from './features/catalogo/pages/catalogo/catalogo';
import { ProductoDetallePage } from './features/producto/pages/producto-detalle/producto-detalle';
import { Login } from './features/auth/pages/login/login';
import { Registro } from './features/auth/pages/registro/registro';
import { Carrito } from './features/carrito/pages/carrito/carrito';
import { Checkout } from './features/checkout/pages/checkout/checkout';
import { CheckoutSuccess } from './features/checkout/pages/checkout-success/checkout-success';
import { CheckoutPending } from './features/checkout/pages/checkout-pending/checkout-pending';
import { CheckoutFailure } from './features/checkout/pages/checkout-failure/checkout-failure';
import { Perfil } from './features/perfil/pages/perfil/perfil';
import { adminGuard } from './core/guards/admin.guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminDashboard } from './features/admin/pages/dashboard/admin-dashboard';
import { AdminProductos } from './features/admin/pages/productos/admin-productos';
import { AdminCategorias } from './features/admin/pages/categorias/admin-categoria';
import { AdminMarcas } from './features/admin/pages/marcas/admin-marcas/admin-marcas';
import { AdminUsuarios } from './features/admin/pages/usuarios/admin-usuarios/admin-usuarios';
import { AdminPedidos } from './features/admin/pages/pedidos/admin-pedidos/admin-pedidos';
import { Pedidos } from './features/perfil/pages/mis-pedidos/mis-pedidos';
import { MisFavoritos } from './features/perfil/pages/mis-favoritos/mis-favoritos';
import { authGuard } from './core/guards/auth.guard';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [

    {
        path: '',
        component: PublicLayout,
        children: [

            {
                path: '',
                component: Home
            },

            {
                path: 'catalogo',
                component: Catalogo
            },

            {
                path: 'productos/:slug',
                component: ProductoDetallePage
            },

            {
                path: 'login',
                component: Login
            },

            {
                path: 'registro',
                component: Registro
            },
            {
                path: 'mi-perfil',
                component: Perfil,
                canActivate: [authGuard]
            },
            {
                path: 'mis-pedidos',
                component: Pedidos,  
                canActivate: [authGuard]
            },

            {
                path: 'mis-favoritos',
                component: MisFavoritos,
                canActivate: [authGuard]
            },

            {
                path: 'carrito',
                component: Carrito
            },
            {
                path: 'checkout',
                component: Checkout
            },

            {
                path: 'checkout/success',
                component: CheckoutSuccess
            },
            {
                path: 'checkout/pending',
                component: CheckoutPending
            },
            {
                path: 'checkout/failure',
                component: CheckoutFailure
            },

        ]
    },

    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [adminGuard],

        children: [

            {
                path: '',
                component: AdminDashboard
            },

            {
                path: 'productos',
                component: AdminProductos
            },
            
            {
                path: 'categorias',
                component: AdminCategorias
            },

            {
                path: 'marcas',
                component: AdminMarcas
            },

            {
                path: 'usuarios',
                component: AdminUsuarios
            },

            {
                path: 'pedidos',
                component: AdminPedidos
            }
        ]
    },

    {
        path: '**',
        component: NotFound
    }

];
