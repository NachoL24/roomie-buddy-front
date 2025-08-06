import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { UserMenuComponent } from "../user-menu/user-menu";
import { ThemeService } from "@presentation/shared/services";

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, UserMenuComponent],
  template: `
    <mat-toolbar color="primary">
      @if (theme.resolvedTheme() === 'dark') {
        <img src="assets/icon-light.png" alt="Logo" class="logo"/>
      } @else {
        <img src="assets/icon-dark.png" alt="Logo" class="logo"/>
      }
      <span class="title-text">Roomie Buddy</span>
      <span class="spacer"></span>
      <app-user-menu/>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
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
  `]
})
export class ToolbarComponent {

  theme = inject(ThemeService);

  doSomeAction() {
    console.log('Action performed');
  }
}
