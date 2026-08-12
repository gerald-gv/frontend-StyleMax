import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class Registro {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    telefono: ['']
  });


  registrarse(): void {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.register(this.formulario.getRawValue()).subscribe({
      next: (response) => {
        this.authService.guardarSesion(response);

        this.loading.set(false);

        this.router.navigate(['/']);
      },

      error: (error) => {
        this.loading.set(false);

        if (error.status === 409) {
          this.error.set('Ese correo ya está registrado.');
          return;
        }

        this.error.set(
          'No pudimos crear tu cuenta. Inténtalo nuevamente.'
        );
      }
    });
  }

}