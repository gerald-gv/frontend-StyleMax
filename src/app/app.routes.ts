import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Home } from './features/home/pages/home/home';
import { Catalogo } from './features/catalogo/pages/catalogo/catalogo';

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

        ]
    }

];
