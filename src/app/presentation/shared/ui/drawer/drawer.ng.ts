import { Component, inject } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { GlobalUserService } from "@application/use-cases";

@Component({
  selector: "app-drawer",
  standalone: true,
  imports: [
    MatSidenavModule,
  ],
  template: `
    <mat-drawer-container class="drawer-container">
      <mat-drawer mode="side" [opened]="userState.isLoggedIn()" class="drawer">
        
      </mat-drawer>
      <mat-drawer-content>
        <ng-content select="[drawer-content]"></ng-content>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [`
    .drawer {
      position: fixed;
      top: 64px;
      z-index: 10;
      width: 220px;
    }

    mat-drawer-content {
      margin-left: 0;
      min-height: 100%;
      transition: margin-left 0.5s ease;
    }
  `]
})
export class DrawerComponent {
  public userState = inject(GlobalUserService);
}
