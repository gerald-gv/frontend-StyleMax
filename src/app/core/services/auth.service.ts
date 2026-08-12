import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { LoginRequest, LoginResponse, RegisterRequest } from "../models/auth.model";
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/auth`;

    private readonly _usuario = signal<LoginResponse | null>(
        this.obtenerUsuarioGuardado()
    );

    readonly usuario = this._usuario.asReadonly();

    readonly autenticado = computed(() => this._usuario() !== null);


    login(request: LoginRequest) {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
    }


    register(request: RegisterRequest) {
        return this.http.post<LoginResponse>(`${this.apiUrl}/register`,request);
    }


    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        this._usuario.set(null);
    }


    guardarSesion(response: LoginResponse): void {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(response));

        this._usuario.set(response);
    }

    private obtenerUsuarioGuardado(): LoginResponse | null {
        const usuario = localStorage.getItem('usuario');

        if (!usuario) {
            return null;
        }

        try {
            return JSON.parse(usuario) as LoginResponse;
        } catch {
            localStorage.removeItem('usuario');
            localStorage    .removeItem('token');

            return null;
        }
    }
}