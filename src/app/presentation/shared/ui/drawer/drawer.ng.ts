import { Component } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";

@Component({
  selector: "app-drawer",
  standalone: true,
  imports: [
    MatSidenavModule,
  ],
  template: `
    <mat-drawer-container class="drawer-container">
      <mat-drawer mode="side" opened class="drawer">
        <div class="drawer-header-content">
          <h2>Drawer Header</h2>
        </div>
      </mat-drawer>
      <mat-drawer-content>
        <ng-content select="[drawer-content]"></ng-content>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [`
    .drawer-container {
      height: 100%;
    }

    .drawer {
      background-color: var(--mat-sys-primary);
      height: 100%;
    }
  `]
})
export class DrawerComponent {
}
