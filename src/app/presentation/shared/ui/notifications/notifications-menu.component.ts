import { Component, inject, OnInit, OnDestroy, signal } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { InvitationService } from "@application/use-cases";
import { Invitation } from "@domain/entities";
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-notifications-menu",
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Notifications">
      <mat-icon [matBadge]="notifications().length" matBadgeColor="accent">notifications</mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="menu">
      @for (notification of notifications(); track notification.id) {
        <div class="item">
          <mat-icon>description</mat-icon>
          <span>{{ notification.inviterName }} te ha invitado a unirte a la casa '{{ notification.houseName }}'</span>
          <button mat-icon-button color="primary" (click)="acceptInvitation(notification)">
            <mat-icon>check</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="declineInvitation(notification)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }
    </mat-menu>
  `,
  styles: [`
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .menu {
      width: 600px !important;
    }
  `]
})
export class NotificationsMenuComponent implements OnInit, OnDestroy {
  service = inject(InvitationService);
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
    });
  }

  declineInvitation(notification: Invitation) {
    this.service.declineInvitation(notification.id).subscribe(() => {
      this.notifications.update(notifs => notifs.filter(n => n.id !== notification.id));
      this.snack.open("Invitación rechazada", "Cerrar", { duration: 3000 });
    });
  }
}
