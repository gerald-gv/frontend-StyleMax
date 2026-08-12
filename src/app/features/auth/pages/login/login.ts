import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');

  readonly formulario = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });


  iniciarSesion(): void {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.formulario.getRawValue()).subscribe({
      next: (response) => {
        this.authService.guardarSesion(response);

        this.loading.set(false);

        this.router.navigate(['/']);
      },

      error: (error) => {
        this.loading.set(false);

        if (error.status === 401) {
          this.error.set('El correo o la contraseña son incorrectos.');
          return;
        }

        this.error.set(
          'No pudimos iniciar sesión. Inténtalo nuevamente.'
        );
      }
    });

  }
}
