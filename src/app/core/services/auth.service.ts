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

    login(request: LoginRequest): void {
        this.http.post<LoginResponse>(`${this.apiUrl}/login`,request)
        .subscribe({
            next: (response) => {
                this.guardarSesion(response);
            }
        });
    }

    register(request: RegisterRequest): void {
        this.http.post<LoginResponse>(`${this.apiUrl}/register`,request)
        .subscribe({
            next: (response) => {
                this.guardarSesion(response);
            }
        });
    }

    logout(): void {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');

        this._usuario.set(null);
    }


    // Metodos Auxiliares

    private obtenerUsuarioGuardado(): LoginResponse | null {
        const usuario = sessionStorage.getItem('usuario');

        if (!usuario) {
            return null;
        }

        try {
            return JSON.parse(usuario) as LoginResponse;
        } catch {
            sessionStorage.removeItem('usuario');
            sessionStorage.removeItem('token');

            return null;
        }
    }

    private guardarSesion(response: LoginResponse): void {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('usuario', JSON.stringify(response));

        this._usuario.set(response);
    }
}