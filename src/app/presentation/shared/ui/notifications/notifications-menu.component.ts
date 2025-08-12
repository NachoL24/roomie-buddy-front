import { DatePipe } from "@angular/common";
import { Component, inject, OnInit, OnDestroy, signal } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { InvitationService, HouseService } from "@application/use-cases";
import { Invitation } from "@domain/entities";
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-notifications-menu",
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule, DatePipe],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Notifications">
      <mat-icon [matBadge]="notifications().length > 0 ? notifications().length : null" matBadgeColor="accent">notifications</mat-icon>
    </button>
  <mat-menu #menu="matMenu">
    @if (notifications().length === 0) {
      <div mat-menu-item disabled>No hay notificaciones</div>
    } @else {
      @for (notification of notifications(); track notification.id) {
        <div mat-menu-item class="item">
          <mat-icon class="leading">description</mat-icon>
          <div class="description">
            <span class="text">{{ notification.inviterName }} te ha invitado a unirte a la casa '{{ notification.houseName }}'</span>
            <span class="email">{{ notification.inviterEmail }}</span>
            <span class="time">{{ notification.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <div class="actions">
            <button mat-icon-button color="primary" (click)="acceptInvitation(notification)" aria-label="Aceptar invitación">
              <mat-icon>check</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="declineInvitation(notification)" aria-label="Rechazar invitación">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
      }
    }
    </mat-menu>
  `,
  styles: [`
    /* Ensancha el panel y permite scroll si hay muchas notificaciones */
    ::ng-deep .mat-mdc-menu-panel {
      width: auto;            /* que el contenido defina */
      max-width: 90vw !important;        /* no exceder viewport */
    }

    ::ng-deep .mat-mdc-menu-item-text {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      padding: 8px 0;
      gap: 12px;
    }
    .item {
      display: flex;
      flex-direction: row !important;
      align-items: center;
    }
    .description {
      display: flex;
      flex-direction: column;
    }
    .text {
      max-width: 320px;
    }
    .actions {
      display: flex;
      flex-direction: row;
    }
  `]
})
export class NotificationsMenuComponent implements OnInit, OnDestroy {
  service = inject(InvitationService);
  houseService = inject(HouseService);
  snack = inject(MatSnackBar);
  notifications = signal<Invitation[]>([]);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Consulta inmediata y luego cada 5 minutos
    timer(0, 5 * 60 * 1000).pipe(
      switchMap(() => this.service.getInvitationNotifications()),
      takeUntil(this.destroy$)
    ).subscribe(notifications => {
      this.notifications.set(notifications);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  acceptInvitation(notification: Invitation) {
    this.service.acceptInvitation(notification.id).subscribe(() => {
      this.notifications.update(notifs => notifs.filter(n => n.id !== notification.id));
      this.snack.open("Invitación aceptada", "Cerrar", { duration: 3000 });
      // actualizar casas en el drawer
      this.houseService.triggerRefresh();
    });
  }

  declineInvitation(notification: Invitation) {
    this.service.declineInvitation(notification.id).subscribe(() => {
      this.notifications.update(notifs => notifs.filter(n => n.id !== notification.id));
      this.snack.open("Invitación rechazada", "Cerrar", { duration: 3000 });
      // puede que no sea necesario, pero si el backend cambia estado, refrescamos
      this.houseService.triggerRefresh();
    });
  }
}
