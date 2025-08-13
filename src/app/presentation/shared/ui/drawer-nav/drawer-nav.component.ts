import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, Subject, takeUntil } from 'rxjs';
import { HouseService, GlobalUserService } from '@application/use-cases';
import { HouseMinimal } from '@domain/entities';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateHouseDialogComponent } from '@presentation/shared/ui/create-house-dialog/create-house-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NavigationService } from '@presentation/shared/services';

@Component({
  selector: 'app-drawer-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <nav class="drawer-nav">
      <mat-nav-list>
        <!-- Mis Finanzas Section -->
        <h3 matSubheader>Mis Finanzas</h3>
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active-item" (click)="navigationAction()">
          <mat-icon matListItemIcon>account_balance_wallet</mat-icon>
          <span matListItemTitle>Finanzas Personales</span>
        </a>


        <!-- Mis Casas Section -->
        <h3 matSubheader>Mis Casas</h3>

        @if (houseslist(); as houses) {
          @for (house of houses; track house.id) {
            <a mat-list-item
               [routerLink]="['/house', house.id, 'dashboard']"
               routerLinkActive="active-item" (click)="navigationAction()">
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
      <button matButton="tonal" class="new-house-button" (click)="createHouse()">
          <mat-icon matListItemIcon>add_home</mat-icon>
          <span matListItemTitle>Crear Casa</span>
      </button>
    </nav>
  `,
  styles: [`

    .drawer-nav {
      padding: 0 6px 0 12px;
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
export class DrawerNavComponent implements OnInit, OnDestroy {
  private houseService = inject(HouseService);
  private userService = inject(GlobalUserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  navigationService = inject(NavigationService);

  houses$!: Observable<HouseMinimal[]>;
  houseslist = signal<HouseMinimal[]>([]);
  private destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      if (this.navigationService.refreshHousesNeeded()) {
        this.houseService.getHousesByRoomieId(this.userService.user()!.id).subscribe(houses => {
          // Defer update to avoid changing bindings mid-change-detection
          setTimeout(() => {
            this.houseslist.set(houses);
            this.navigationService.finishRefresh();
          }, 0);
        });
      }
    });
  }

  ngOnInit() {
    // Obtener las casas del usuario actual
    const currentUser = this.userService.user();
    if (currentUser) {
      this.houseService.getHousesByRoomieId(currentUser.id).subscribe(houses => {
        // Defer initial list set to avoid ExpressionChanged after first render
        setTimeout(() => {
          this.houseslist.set(houses);
        }, 0);
      });
    }


  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createHouse() {
    const dialogRef = this.dialog.open(CreateHouseDialogComponent, {
      width: '400px',
      autoFocus: true,
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((name?: string) => {
      const trimmed = (name ?? '').trim();
      if (!trimmed) return; // cancelado o vacío

      this.houseService.createHouse(trimmed).subscribe({
        next: (house) => {
          this.snackBar.open('Casa creada', 'Cerrar', { duration: 2500 });
          // refrescar listado mediante NavigationService para unificar lógica
          this.navigationService.refreshHouses();
          // navegar a la nueva casa
          this.router.navigate(['/house', house.id, 'dashboard']);
        },
        error: (err) => {
          console.error('Error creating house', err);
          this.snackBar.open('Error al crear la casa', 'Cerrar', { duration: 3000 });
        }
      });
    });
  }

  navigationAction() {
    if (this.navigationService.isMobile()) {
      this.navigationService.closeDrawer();
    }
  }
}
