import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { LoginRequest, LoginResponse, RegisterRequest } from "../models/auth.model";
import { CarritoService } from "./carrito.service";
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly carritoService = inject(CarritoService);

    private readonly _usuario = signal<LoginResponse | null>(
        this.obtenerUsuarioGuardado()
    );

    private expiracionTimer: ReturnType<typeof setTimeout> | null = null;

    readonly usuario = this._usuario.asReadonly();

    readonly autenticado = computed(() => this._usuario() !== null);


    login(request: LoginRequest) {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
    }


    register(request: RegisterRequest) {
        return this.http.post<LoginResponse>(`${this.apiUrl}/register`, request);
    }


    logout(): void {
        this.limpiarSesion();
        this.carritoService.limpiarCarrito();
    }


    guardarSesion(response: LoginResponse): void {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(response));

        this._usuario.set(response);
        this.programarExpiracion(response.token);
        this.carritoService.obtenerCarrito();
    }

    private obtenerUsuarioGuardado(): LoginResponse | null {
        const usuario = localStorage.getItem('usuario');
        const token = localStorage.getItem('token');

        if (!usuario || !token) {
            localStorage.removeItem('usuario');
            localStorage.removeItem('token');
            return null;
        }

        try {
            const usuarioGuardado = JSON.parse(usuario) as LoginResponse;

            if (this.tokenExpirado(token)) {
                console.log('La sesión ha expirado');

                localStorage.removeItem('usuario');
                localStorage.removeItem('token');

                return null;
            }

            return usuarioGuardado;

        } catch {
            localStorage.removeItem('usuario');
            localStorage.removeItem('token');

            return null;
        }
    }

    private programarExpiracion(token: string): void {

        if (this.expiracionTimer) {
            clearTimeout(this.expiracionTimer);
        }

        try {
            const payload = this.obtenerPayload(token);

            const expiracion = payload.exp * 1000;
            const ahora = Date.now();

            const tiempoRestante = expiracion - ahora;

            if (tiempoRestante <= 0) {
                this.logout();
                return;
            }

            console.log(
                `Sesión válida. Expira en ${Math.round(tiempoRestante / 1000)} segundos`
            );

            this.expiracionTimer = setTimeout(() => {

                console.log('JWT expirado. Cerrando sesión.');

                this.logout();

            }, tiempoRestante);

        } catch (error) {
            console.error('Token inválido:', error);
            this.logout();
        }
    }


    private tokenExpirado(token: string): boolean {
        try {
            const payload = this.obtenerPayload(token);

            return payload.exp * 1000 <= Date.now();

        } catch {
            return true;
        }
    }


    private obtenerPayload(token: string): { exp: number } {

        const partes = token.split('.');

        if (partes.length !== 3) {
            throw new Error('JWT inválido');
        }

        const payloadBase64 = partes[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const payload = JSON.parse(
            atob(payloadBase64)
        );

        if (!payload.exp) {
            throw new Error('El JWT no contiene fecha de expiración');
        }

        return payload;
    }


    private limpiarSesion(): void {

        if (this.expiracionTimer) {
            clearTimeout(this.expiracionTimer);
            this.expiracionTimer = null;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        this._usuario.set(null);
    }
}