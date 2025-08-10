import { Component, computed } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { GlobalUserService } from '@application/use-cases';
import { User } from '@domain/entities';

@Component({
  selector: 'user-info',
  imports: [MatDividerModule],
  template: `
        <div class="user-info-menu">
          <div class="row">
          @if (userPic(); as pic) {
            <img class="user-avatar" [src]="pic" alt="User Avatar" />
          }
          <div class="user-info">
          <div class="user-name">{{ userName() }}</div>
          @if (userEmail(); as email) {
            <div class="user-email">{{ email }}</div>
          }
          </div>
          </div>
        </div>
  `,
  styles: [`
    .user-info-menu {
      padding: 12px 16px;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
      color: var(--mat-sys-on-surface);
    }

    .user-email {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }
  `],
})
export class UserInfoComponent {

  constructor(public userState: GlobalUserService) { }

  userName = computed(() => {
    if (this.userState.isLoggedIn()) {
      const user: User | null = this.userState.user();
      if (user) {
        return user.firstName + ' ' + user.lastName || 'Usuario';
      }

      return 'Usuario';
    }
    return 'Invitado';
  });

  /**
   * Computed signal que obtiene el email del usuario
   */
  userEmail = computed(() => {
    if (this.userState.isLoggedIn()) {
      const user: User | null = this.userState.user();
      if (user) {
        return user.email || 'Sin email';
      }
      return 'Sin email';
    }
    return 'Sin email';
  });

  userPic = computed(() => {
    if (this.userState.isLoggedIn()) {
      const user: User | null = this.userState.user();
      if (user) {
        return user.pic;
      }
      return null;
    }
    return null;
  });
}
