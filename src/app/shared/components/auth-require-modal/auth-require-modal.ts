import { Component, HostListener, output } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'auth-required-modal',
    imports: [RouterLink],
    templateUrl: './auth-require-modal.html',
    styleUrl: './auth-require-modal.css'
})
export class AuthRequiredModal {

    cerrar = output<void>();

    cerrarModal(): void {
        this.cerrar.emit();
    }

    @HostListener('document:keydown.escape')
    cerrarConEsc(): void {
        this.cerrarModal();
    }

    cerrarAlClickearBackdrop(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.cerrarModal();
        }
    }
}