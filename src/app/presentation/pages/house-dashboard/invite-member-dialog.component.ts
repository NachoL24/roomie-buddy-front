import { Component, effect, Inject, inject, OnChanges, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InvitationService, UserService } from '@application/use-cases';
import { User } from '@domain/entities';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface DialogData { houseId: number; roomies: User[]; }

@Component({
  selector: 'app-invite-member-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>Invite Member</h2>
    <div mat-dialog-content class="form">
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Email</mat-label>
        <input matInput [formControl]="email">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
        @if (loading()) {
          <mat-progress-spinner></mat-progress-spinner>
        } @else {
            @if (users.length > 0) {
              <div class="user-list">
              @for (user of users; track user.id) {
                <mat-card>
                  <mat-card-content class="user-card">
                    <img class="user-pic" [src]="user.pic" alt="{{ user.firstName }} {{ user.lastName }}" alt="avatar" loading="eager" fetchpriority="high" decoding="async">
                    <div class="user-info">
                      <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                      <span class="user-email">{{ user.email }}</span>
                    </div>
                    @if (invitable(user)) {
                      <button matIconButton (click)="inviteUser(user)">
                        <mat-icon>add</mat-icon>
                      </button>
                    } @else {
                      <button matIconButton disabled>
                        <mat-icon>check</mat-icon>
                      </button>
                    }
                  </mat-card-content>
                </mat-card>
              }
            </div>
            }
        }
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="close(false)">Cerrar</button>
    </div>
  `,
  styles: [`
  .form {
    display: flex;
    flex-direction: column;
    width: 360px;
  }

  .form-field {
    width: 100%;
    margin-top: 4px;
  }

  .user-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .user-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .user-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: bold;
  }

  .user-email {
    color: gray;
  }
  `]
})
export class InviteMemberDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<InviteMemberDialogComponent>);
  private invitationService = inject(InvitationService);
  private userService = inject(UserService);
  loading = signal(false);
  users: User[] = [];

  email = new FormControl<string>('', { nonNullable: true });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.email.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.loading.set(true);
      this.userService.findUserByEmail(this.email.value, this.data.houseId).subscribe(users => {
        this.users = users;
        this.loading.set(false);
      });
    });
  }

  invite() {
    this.invitationService.inviteUserToHouse(this.email.value, this.data.houseId).subscribe(() => this.close(true));
  }

  close(ok: boolean) { this.dialogRef.close(ok); }

  inviteUser(user: User) {
    this.invitationService.inviteUserToHouse(user.email, this.data.houseId).subscribe(() => this.close(true));
  }

  invitable(user: User): boolean {
    return !this.data.roomies.some(r => r.email === user.email);
  }
}
