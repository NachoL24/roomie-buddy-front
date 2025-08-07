import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { UserMenuComponent } from "../user-menu/user-menu";
import { ThemeService, NavigationService } from "@presentation/shared/services";
import { AuthenticationService, GlobalUserService } from "@application/use-cases";
import { MatMenuModule } from "@angular/material/menu";
import { ThemeSwitcherComponent } from "../theme-switcher/theme-switcher";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, UserMenuComponent, MatMenuModule, ThemeSwitcherComponent, CommonModule],
  template: `
    <mat-toolbar color="primary">
      @if (theme.resolvedTheme() === 'dark') {
        <img src="assets/icon-light.png" alt="Logo" class="logo"/>
      } @else {
        <img src="assets/icon-dark.png" alt="Logo" class="logo"/>
      }
      <span class="title-text">Roomie Buddy</span>

      <span class="spacer"></span>
      @if (globalUser.isLoggedIn()) {
        <app-user-menu/>
      } @else {
        <button mat-button class="nav-button" (click)="scrollToCharacteristics()">
          Características
        </button>
        <button mat-button class="nav-button" (click)="scrollToPricing()">
          Precios
        </button>
        <button class="login-button" mat-flat-button (click)="auth.login()">
          <mat-icon>login</mat-icon>
          <div class="login-text">Iniciar sesión</div>
        </button>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>{{ theme.resolvedTheme() }}_mode</mat-icon>
          <mat-menu #menu="matMenu">
            <app-theme-switcher/>
        </mat-menu>
        </button>
      }
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .login-button {
      margin-right: 10px;
    }

    .logo {
      height: 40px;
      margin-right: 5px;
      color: var(--mat-sys-primary);
    }

    .title-text {
        font-size: 24px;
        font-family: "Dancing Script", cursive;
        font-optical-sizing: auto;
        font-weight: 700;
        color: var(--mat-sys-primary);
    }

    .nav-button {
      margin-right: 16px;
      color: white;
      font-weight: 500;

      @media (max-width: 650px) {
        display: none;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    @media (max-width: 450px) {
      .title-text {
        display: none;
      }
    }
  `]
})
export class ToolbarComponent {
  globalUser = inject(GlobalUserService);
  auth = inject(AuthenticationService);
  theme = inject(ThemeService);
  navigationService = inject(NavigationService);
  router = inject(Router);

  isHomepage(): boolean {
    return this.router.url === '/' || this.router.url === '/homepage';
  }

  scrollToCharacteristics(): void {
    this.navigationService.scrollToSection('caracteristicas');
  }

  scrollToPricing(): void {
    this.navigationService.scrollToSection('precios');
  }
}
