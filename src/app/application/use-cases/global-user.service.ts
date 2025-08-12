import { Injectable, signal, computed, effect } from '@angular/core';
import { Observable, BehaviorSubject, switchMap, tap, of, finalize, filter, take } from 'rxjs';
import { User } from '../../domain/entities';
import { AuthService } from '@auth0/auth0-angular';
import { UserRepository } from '../../domain/repositories';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class GlobalUserService {
  // estado
  private _user = signal<User | null>(null);
  private _ready = signal(false);
  private _loading = signal(false);
  private loadedOnce = false;              // evita cargas duplicadas

  // lecturas públicas
  user = this._user.asReadonly();
  ready = this._ready.asReadonly();
  loading = this._loading.asReadonly();
  isLoggedIn = computed(() => !!this._user());
  email = computed(() => this._user()?.email ?? null);

  // auth0 → signal
  private isAuth!: ReturnType<typeof toSignal<boolean>>;

  constructor(private auth: AuthService, private repo: UserRepository) {
    this.isAuth = toSignal(this.auth.isAuthenticated$, { initialValue: false });
    effect(() => {
      if (this.isAuth()) this.ensureLoaded();
      else this.reset();
    });
  }

  /** Fuerza cargar desde el backend si aún no lo hiciste en esta sesión */
  ensureLoaded() {
    if (this.loadedOnce || this._loading()) return;
    this._loading.set(true);
    this.repo.getOrCreateUserFromBackend()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: u => { this._user.set(u); this._ready.set(true); this.loadedOnce = true; },
        error: _ => { this._ready.set(false); this.loadedOnce = false; },
      });
  }

  loadOnce$() {
    // no vuelvas a pedir si ya está listo
    if (this.ready()) return of(this.user());
    this.ensureLoaded();
    return toObservable(this.ready).pipe(
      filter(r => r === true),
      take(1),
      switchMap(() => of(this.user()))
    );
  }

  /** Útil tras editar el perfil */
  refresh() { this.loadedOnce = false; this.ensureLoaded(); }

  /** Permite setear el usuario luego de una actualización explícita */
  setUser(u: User | null) {
    this._user.set(u);
    this._ready.set(!!u);
    if (u) this.loadedOnce = true;
  }

  /** Limpiar estado al desloguear o expirar sesión */
  private reset() {
    this._user.set(null);
    this._ready.set(false);
    this._loading.set(false);
    this.loadedOnce = false;
  }
}
