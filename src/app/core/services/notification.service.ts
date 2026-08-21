import { inject, Injectable } from "@angular/core";
import { HotToastService, ToastOptions } from "@ngxpert/hot-toast";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private readonly toast = inject(HotToastService);


    // SUCCESS

    private readonly successOptions: ToastOptions<unknown> = {

        duration: 2200,

        className: 'app-toast app-toast-success',

        style: {
            background: 'rgba(240, 253, 244, 0.92)',
            color: '#166534',
            border: '1px solid rgba(74, 222, 128, 0.35)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(22, 101, 52, 0.10)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            fontWeight: '600'
        },

        iconTheme: {
            primary: '#16a34a',
            secondary: '#f0fdf4'
        }

    };


    // ERROR

    private readonly errorOptions: ToastOptions<unknown> = {

        duration: 3500,

        className: 'app-toast app-toast-error',

        style: {
            background: 'rgba(254, 242, 242, 0.92)',
            color: '#991b1b',
            border: '1px solid rgba(248, 113, 113, 0.35)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(153, 27, 27, 0.10)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            fontWeight: '600'
        },

        iconTheme: {
            primary: '#dc2626',
            secondary: '#fef2f2'
        }

    };


    // WARNING

    private readonly warningOptions: ToastOptions<unknown> = {

        duration: 3000,

        className: 'app-toast app-toast-warning',

        style: {
            background: 'rgba(255, 251, 235, 0.92)',
            color: '#92400e',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(146, 64, 14, 0.10)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            fontWeight: '600'
        },

        iconTheme: {
            primary: '#d97706',
            secondary: '#fffbeb'
        }

    };


    // INFO

    private readonly infoOptions: ToastOptions<unknown> = {

        duration: 2500,

        className: 'app-toast app-toast-info',

        style: {
            background: 'rgba(239, 246, 255, 0.92)',
            color: '#1e40af',
            border: '1px solid rgba(96, 165, 250, 0.35)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(30, 64, 175, 0.10)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            fontWeight: '600'
        },

        iconTheme: {
            primary: '#2563eb',
            secondary: '#eff6ff'
        }

    };


    success(message: string): void {
        this.toast.success(
            message,
            this.successOptions
        );
    }


    error(message: string): void {
        this.toast.error(
            message,
            this.errorOptions
        );
    }


    warning(message: string): void {
        this.toast.warning(
            message,
            this.warningOptions
        );
    }


    info(message: string): void {
        this.toast.info(
            message,
            this.infoOptions
        );
    }


    loading(message: string): void {

        this.toast.loading(message, {

            className: 'app-toast app-toast-loading',

            style: {
                background: 'rgba(31, 41, 55, 0.92)',
                color: '#f9fafb',
                border: '1px solid rgba(156, 163, 175, 0.20)',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                fontWeight: '600'
            }

        });

    }


    observe<T>(options: {
        loading: string;
        success: string;
        error: string;
    }) {

        return this.toast.observe(options);

    }

}