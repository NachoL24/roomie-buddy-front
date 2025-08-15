import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuItem } from "@angular/material/menu";
import { AuthenticationService } from "@application/index";

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

    .logout-button:hover {
      background-color: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
    }
  `
  ],
})
export class LogoutButtonComponent {

  constructor(public authService: AuthenticationService) { }

  async logout(): Promise<void> {
    this.authService.logout();
  }
}
