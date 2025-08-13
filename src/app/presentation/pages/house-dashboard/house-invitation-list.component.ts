import { Component, DestroyRef, effect, inject, input, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { InvitationService, UserService } from "@application/use-cases";
import { Invitation, User } from "@domain/entities";
import { Subscription, forkJoin, of } from "rxjs";
import { switchMap, tap, finalize } from "rxjs/operators";

@Component({
  selector: 'app-house-invitation-list',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <h2>Invitaciones</h2>
    @if (loading()) {
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    } @else {
      @for (inv of invitations(); track inv.id) {
        <mat-card class="item">
          <span class="user-name">{{ getUserFullName(inv.inviteeId) }}</span>
          <span class="invitation-status">{{ inv.status }}</span>
          <mat-icon>close</mat-icon>
        </mat-card>
      }
    }
  `,
  styles: [`
    .user-name {
      font-weight: bold;
    }
    .item {
      display: flex;
      flex-direction: row;
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
    },
    { allowSignalWrites: true }
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
}
