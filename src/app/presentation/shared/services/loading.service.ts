import { effect, inject, Injectable, signal } from '@angular/core';
import { GlobalUserService } from '@application/use-cases';
import { AuthService } from '@auth0/auth0-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = signal(true);
  private _forceLoading = signal(false);
  private globalUserService = inject(GlobalUserService);
  private auth = inject(AuthService);
  // Mantener Router disponible por si se requiere en el futuro, pero evitar navegar desde efectos
  private router = inject(Router);

  // Auth0 states as signals
  private isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  private isLoading$ = toSignal(this.auth.isLoading$, { initialValue: true });

  // Readonly signal para que solo el servicio pueda modificar el estado
  isLoading = this._isLoading.asReadonly();

  constructor() {
    effect(() => {
      // Si está forzado, mantener loading activo y no evaluar el resto
      if (this._forceLoading()) {
        this.show();
        return;
      }

      const authLoading = this.isLoading$();
      const authenticated = this.isAuthenticated();
      const userReady = this.globalUserService.ready();

      // Mientras Auth0 está cargando (verificando autenticación), mostrar loading
      if (authLoading) {
        this.show();
        return;
      }

      // Auth0 terminó de cargar, ahora sabemos el estado real

      // Si no está autenticado, ocultar loading (mostrar homepage)
      if (!authenticated) {
        this.hide();
        return;
      }

      // Si está autenticado pero el usuario no está listo, mostrar loading
      if (authenticated && !userReady) {
        this.show();
        return;
      }

      // Si está autenticado y el usuario está listo, ocultar loading
      if (authenticated && userReady) {
        this.hide();
      }
    });
  }

  show() {
    if (!this._isLoading()) {
      this._isLoading.set(true);
    }
  }

  hide() {
    if (this._isLoading()) {
      this._isLoading.set(false);
    }
    // Importante: no navegar aquí. La navegación desde un efecto puede causar bucles de change detection (NG0103).
    // La redirección post-login se maneja explícitamente en AuthCallbackComponent y guards.
  }

  toggle() {
    this._isLoading.set(!this._isLoading());
  }

  // Fuerza el estado de loading para escenarios como el callback de Auth0
  forceOn() { this._forceLoading.set(true); this.show(); }
  forceOff() { this._forceLoading.set(false); this.hide(); }
}
