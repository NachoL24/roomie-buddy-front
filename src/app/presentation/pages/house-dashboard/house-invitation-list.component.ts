import { Component, DestroyRef, effect, inject, input, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { InvitationService, UserService } from "@application/use-cases";
import { Invitation, InvitationStatus, User } from "@domain/entities";
import { Subscription, forkJoin, of } from "rxjs";
import { switchMap, tap, finalize } from "rxjs/operators";

@Component({
  selector: 'app-house-invitation-list',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, MatTooltipModule],
  template: `
    <h2 class="title">Invitaciones pendientes</h2>
    @if (loading()) {
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    } @else {
      @if (invitations().length === 0) {
        <p>No hay invitaciones pendientes.</p>
      }
      @for (inv of invitations(); track inv.id) {
        <mat-card appearance="outlined" class="item">
          <span class="user-name">{{ getUserFullName(inv.inviteeId) }}</span>
          <button mat-icon-button matTooltip="Cancelar invitación" class="close-button" (click)="cancelInvitation(inv.id)">
            <mat-icon>close</mat-icon>
          </button>
        </mat-card>
      }
    }
  `,
  styles: [`
    .title {
      margin-bottom: 16px;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: bold;
    }
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
    }

    .invitation-status {
      margin-top: 4px;
      height: fit-content;
      padding: 4px 8px;
    }

    .close-button-container {
    }

    .close-button {
      color: var(--mat-sys-error)
    }
  `]
})
export class HouseInvitationListComponent implements OnInit {
  houseId = input.required<number>();
  invitationsService = inject(InvitationService);
  userService = inject(UserService)
  invitations = signal<Invitation[]>([]);
  users = signal<User[]>([]);
  loading = signal<boolean>(true);
  private sub?: Subscription;
  private destroyRef = inject(DestroyRef);

  // React to houseId changes
  private _watchId = effect(
    () => {
      const id = this.houseId();
      if (id != null) {
        this.refresh();
      }
    }
  );

  ngOnInit() { }

  private refresh() {
    this.loading.set(true);
    const id = this.houseId();
    this.sub?.unsubscribe();
    this.sub = this.invitationsService
      .getHouseInvitations(id)
      .pipe(
        tap((invitations) => this.invitations.set(invitations)),
        switchMap((invitations) =>
          invitations.length
            ? forkJoin(invitations.map((inv) => this.userService.findUserById(inv.inviteeId)))
            : of([] as User[])
        ),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (users) => this.users.set(users),
        error: (error) => console.error('Error fetching invitations or users:', error)
      });
  }

  getUserFullName(userId: number): string {
    const user = this.users().find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  cancelInvitation(invitationId: string) {
    this.invitationsService.cancelInvitation(invitationId).subscribe({
      next: () => {
        this.refresh();
      },
      error: (error) => console.error('Error cancelling invitation:', error)
    });
  }
}
