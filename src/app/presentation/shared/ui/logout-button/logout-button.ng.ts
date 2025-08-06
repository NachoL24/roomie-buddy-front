import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuItem } from "@angular/material/menu";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: "login-logout-button",
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuItem],
  template: `
      <button
        mat-menu-item
        (click)="logout()"
        class="logout-button"
      >
        <mat-icon>logout</mat-icon>
        <span>Cerrar sesión</span>
      </button>

  `,
  styles: [
    `
        .logout-button {
      color: var(--mat-sys-error);
    }

    .logout-button mat-icon {
      color: var(--mat-sys-error);
    }

    .login-button {
      color: var(--mat-sys-primary);
    }

    .login-button mat-icon {
      color: var(--mat-sys-primary);
    }
  `
  ],
})
export class LogoutButtonComponent {

  constructor(public authService: AuthService) { }

  async logout(): Promise<void> {
    this.authService.logout();
  }
}
