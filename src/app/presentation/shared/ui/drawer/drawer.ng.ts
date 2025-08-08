import { Component, inject } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { GlobalUserService } from "@application/use-cases";
import { DrawerNavComponent } from "../drawer-nav/drawer-nav.component";

@Component({
  selector: "app-drawer",
  standalone: true,
  imports: [
    MatSidenavModule,
    DrawerNavComponent,
  ],
  template: `
    <mat-drawer-container class="drawer-container">
      <mat-drawer mode="side" [opened]="userState.isLoggedIn()" class="drawer">
        <app-drawer-nav></app-drawer-nav>
      </mat-drawer>
      <mat-drawer-content>
        <ng-content select="[drawer-content]"></ng-content>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [`

    .drawer {
      background-color: var(--mat-sys-surface);
      position: fixed;
      top: 64px;
      left: 0;
      z-index: 10;
      width: 260px;
    }

    mat-drawer-content {
      margin-left: 0;
      transition: margin-left 0.3s ease;
    }

    mat-drawer-container.mat-drawer-container-has-open mat-drawer-content {
      margin-left: 220px;
    }
  `]
})
export class DrawerComponent {
  public userState = inject(GlobalUserService);
}
