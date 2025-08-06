import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService, Theme } from '@presentation/shared/services';
import { ThemeSwitcherComponent } from "../theme-switcher/theme-switcher";
import { LogoutButtonComponent } from "../logout-button/logout-button.ng";
import { UserInfoComponent } from "../user-info/user-info.ng";
import { GlobalUserService } from '@application/use-cases';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule, ThemeSwitcherComponent, LogoutButtonComponent, UserInfoComponent],
  template: `
    <button
      mat-icon-button
      [matMenuTriggerFor]="userMenu"
      class="user-menu-button"
      [attr.aria-label]="'Menú de usuario'"
    >
    	<mat-icon class="user-avatar">account_circle</mat-icon>

    </button>

    <mat-menu #userMenu="matMenu" class="user-menu" xPosition="before">
      <!-- Información del usuario -->
      @if (userState.isLoggedIn()) {
        <user-info/>
        <mat-divider/>
      }

      <!-- Opciones de tema -->
      <div class="menu-section">
        <div class="menu-section-title">Tema</div>
        <app-theme-switcher/>
      </div>

      <mat-divider/>
      <login-logout-button/>
    </mat-menu>
  `,
  styles: [`
    .user-menu-button {
      margin-right: 0.5rem;
      padding: 2px;
    }

    .user-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      color: var(--mat-sys-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 500;
    }

    .menu-section {
      padding: 4px 0 0 0;
    }

    .menu-section-title {
      padding: 0 16px 4px;
      font-size: 12px;
      font-weight: 900;
      color: var(--mat-sys-on-surface-variant);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    ::ng-deep .user-menu {
      min-width: 200px;
    }
  `]
})
export class UserMenuComponent {
  protected themeService = inject(ThemeService);
  public userState = inject(GlobalUserService);
}
