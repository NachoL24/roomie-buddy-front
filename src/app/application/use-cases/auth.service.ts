import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../../domain/entities';
import { AuthService } from '@auth0/auth0-angular';
import { UserRepository } from '../../domain/repositories';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth0: AuthService,
    private userRepository: UserRepository
  ) {
    // Escuchar cambios en el estado de autenticación de Auth0
    this.auth0.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        // Si el usuario está autenticado, obtener/crear el usuario en el backend
        this.initializeUserFromBackend();
      }
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  login(): void {
    this.auth0.loginWithRedirect({
      appState: { target: '/dashboard' }
    });
  }

  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  /**
   * Inicializa el usuario desde el backend después del login con Auth0
   */
  private initializeUserFromBackend(): void {
    console.log('Initializing user from backend after Auth0 login...');
    this.userRepository.getOrCreateUserFromBackend().subscribe({
      next: (user) => {
        console.log('User successfully initialized from backend:', user);
      },
      error: (error) => {
        console.error('Error initializing user from backend:', error);
      }
    });
  }

  /**
   * Método público para forzar la inicialización del usuario
   */
  initializeUser(): Observable<User> {
    return this.userRepository.getOrCreateUserFromBackend();
  }
}
