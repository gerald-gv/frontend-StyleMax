import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Home } from './features/home/pages/home/home';
import { Catalogo } from './features/catalogo/pages/catalogo/catalogo';
import { ProductoDetallePage } from './features/producto/pages/producto-detalle/producto-detalle';
import { Login } from './features/auth/pages/login/login';
import { Registro } from './features/auth/pages/registro/registro';
import { Carrito } from './features/carrito/pages/carrito/carrito';

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
                path: 'carrito',
                component: Carrito
            }

        ]
    }

];
