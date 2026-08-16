import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const adminGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const usuario = authService.usuario();

    if (!usuario) {
        return router.createUrlTree(['/login']);
    }

    if (usuario.rol !== 'ADMINISTRADOR') {
        return router.createUrlTree(['/']);
    }

    return true;
};