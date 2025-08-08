import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { HouseService, GlobalUserService } from '@application/use-cases';
import { HouseMinimal } from '@domain/entities';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-drawer-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  template: `
    <nav class="drawer-nav">
      <mat-nav-list>
        <!-- Mis Finanzas Section -->
        <h3 matSubheader>Mis Finanzas</h3>
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active-item">
          <mat-icon matListItemIcon>account_balance_wallet</mat-icon>
          <span matListItemTitle>Finanzas Personales</span>
        </a>


        <!-- Mis Casas Section -->
        <h3 matSubheader>Mis Casas</h3>

        @if (houses$ | async; as houses) {
          @for (house of houses; track house.id) {
            <a mat-list-item
               [routerLink]="['/dashboard/house', house.id]"
               routerLinkActive="active-item">
              <mat-icon matListItemIcon>home</mat-icon>
              <span matListItemTitle>{{ house.name }}</span>
            </a>
          }

          @if (houses.length === 0) {
            <div class="empty-state">
              <mat-icon>home_work</mat-icon>
              <p>No tienes casas aún</p>
            </div>
          }
        }
      </mat-nav-list>
      <button matButton="tonal" class="new-house-button">
          <mat-icon matListItemIcon>add_home</mat-icon>
          <span matListItemTitle>Crear Casa</span>
      </button>
    </nav>
  `,
  styles: [`

    .drawer-nav {
      padding: 0 12px;
    }

    .new-house-button {
      margin-left: 4px;
    }

    .active-item {
      background-color: var(--mat-sys-surface-variant) !important;
      color: var(--mat-sys-on-surface-variant) !important;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      color: var(--mat-sys-on-surface-variant);
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-bottom: 8px;
      opacity: 0.7;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    h3[matSubheader] {
      color: var(--mat-sys-primary);
      font-weight: 500;
      font-size: 14px;
    }
  `]
})
export class DrawerNavComponent implements OnInit {
  private houseService = inject(HouseService);
  private userService = inject(GlobalUserService);

  houses$!: Observable<HouseMinimal[]>;

  ngOnInit() {
    // Obtener las casas del usuario actual
    const currentUser = this.userService.user();
    if (currentUser) {
      this.houses$ = this.houseService.getHousesByRoomieId(currentUser.id);
    }
  }
}
