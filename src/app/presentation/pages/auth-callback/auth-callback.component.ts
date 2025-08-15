import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { GlobalUserService } from '@application/use-cases';
import { LoadingService } from '@presentation/shared/services';
import { combineLatest, filter, take, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  template: ``,
  styles: []
})
export class AuthCallbackComponent implements OnInit, OnDestroy {
  private auth0 = inject(AuthService);
  private globalUserService = inject(GlobalUserService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private subscription = new Subscription();

  ngOnInit() {
    // Forzar el overlay global de loading mientras se resuelve el callback
    this.loadingService.forceOn();

    // Esperar a que Auth0 termine de procesar y el usuario esté cargado
    this.subscription.add(
      combineLatest([
        this.auth0.isAuthenticated$,
        this.auth0.isLoading$.pipe(filter(loading => !loading)) // Esperar a que termine de cargar
      ]).pipe(
        filter(([isAuthenticated, _]) => isAuthenticated),
        take(1)
      ).subscribe(() => {
        // Una vez autenticado, esperar a que el usuario esté listo y redirigir
        this.subscription.add(
          this.globalUserService.loadOnce$().subscribe(() => {
            this.loadingService.forceOff();
            this.router.navigate(['/dashboard']);
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.loadingService.forceOff();
  }
}
