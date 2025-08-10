import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HouseService, FinancialActivityService } from '@application/use-cases';
import { FinancialActivity, FinancialActivityType, House } from '@domain/entities';
import { NewHouseExpenseDialogComponent } from '@presentation/pages/house-dashboard/new-house-expense-dialog.component';
import { InviteMemberDialogComponent } from '@presentation/pages/house-dashboard/invite-member-dialog.component';
import { HouseExpenseCardComponent } from '@presentation/shared/ui/house-expense-card/house-expense-card.component';
import { PayRatioDialogComponent } from './pay-ratio-dialog.component';

@Component({
  selector: 'app-house-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, HouseExpenseCardComponent],
  template: `
  @if (house()) {
    <div class="house-dashboard">
        <h1>{{ house()?.name }}</h1>

      <div class="content">
        <section class="transactions">
          <div class="header">
            <h2 class="table-title">Transacciones</h2>
            <button mat-stroked-button color="primary" (click)="openNewExpense()">
              <mat-icon>add</mat-icon>
              New Expense
            </button>
          </div>
          @if (activities().length) {
            <div class="card-list">
              @for (act of activities(); track act.id) {
                <app-house-expense-card [activity]="act" (deleted)="refresh(house()!.id)" />
              }
            </div>
          } @else {
            <div class="empty">No transactions yet</div>
          }
        </section>

        <aside class="members">
          <div class="header">
            <h2 class="table-title">Members</h2>
            <div class="buttons">
              <button matIconButton (click)="openInvite()">
                <mat-icon>group_add</mat-icon>
              </button>
              <button matIconButton (click)="openSettings()">
                <mat-icon>settings</mat-icon>
              </button>
            </div>
          </div>
          <ul class="member-list">
            <li *ngFor="let m of house()?.members" class="member-item">
               @if (m.picture) {
                <img class="avatar" [src]="m.picture!" [alt]="m.firstName + ' ' + m.lastName" />
               } @else {
              <div class="avatar">
                {{ initials(m.firstName, m.lastName) }}
              </div>
               }
              <div class="info">
                <div class="name">{{ m.firstName }} {{ m.lastName }}</div>
                <div class="email text-muted">Ratio: {{ m.payRatioPercentage || (m.payRatio * 100)+'%' || 0 }}</div>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </div>
          } @else {
            <div class="loading">Loading...</div>
          }
  `,
  styles: [`
    :host { display: block; }
    .house-dashboard {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 8px;
    }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    h1 { font-size: 32px; margin: 0; }
    .table-title { margin: 0; }
    .content {
      display: grid;
      grid-template-columns: 1fr minmax(200px, 260px);
      gap: 24px;
    }
  .card-list { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .activity-card { border-left: 4px solid var(--mat-sys-outline-variant); border-radius: 12px; padding: 12px; }
  .activity-card.expense { border-left-color: var(--mat-sys-primary); }
  .activity-card.settlement { border-left-color: var(--mat-sys-secondary); }
  .transaction-content { display: flex; align-items: center; gap: 16px; }
  .transaction-left { display: flex; align-items: center; gap: 10px; height: 40px; }
  .transaction-icon { position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: var(--mat-sys-surface-variant); }
  .expense-icon { color: var(--mat-sys-error); }
  .settlement-icon { color: var(--mat-sys-secondary); }
  .payer-avatar { width: 20px; height: 20px; border-radius: 50%; overflow: hidden; background: #f0d7cd; display: inline-flex; align-items: center; justify-content: center; font-weight: 600; color: #6a4a3c; position: absolute; bottom: -6px; left: -6px; }
  .payer-avatar.initials { font-size: 10px; }
  .transaction-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .transaction-description { font-size: 1.05rem; font-weight: 500; color: var(--mat-sys-on-surface); }
  .transaction-payer { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); }
  .payer-name { color: var(--mat-sys-on-surface); font-weight: 500; }
  .transaction-date { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); }
  .transaction-amount-container { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
  .transaction-amount { font-size: 1.2rem; font-weight: 600; }
  .expense-amount { color: var(--mat-sys-primary); }
  .settlement-amount { color: var(--mat-sys-secondary); }
    .empty { padding: 24px; color: var(--mat-sys-on-surface-variant); border: 1px dashed var(--mat-sys-outline-variant); border-radius: 12px; }
    .members { display: flex; flex-direction: column; }
    .member-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
    .member-item { display: flex; gap: 12px; align-items: center; padding: 8px; border-radius: 12px; border: 1px solid var(--mat-sys-outline-variant); }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #f0d7cd; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #6a4a3c; }
    .info .name { font-weight: 600; }
    .text-muted { color: var(--mat-sys-on-surface-variant); margin-top: 2px; font-size: 12px; }
    .invite { width: 100%; }
    .loading { color: var(--mat-sys-on-surface-variant); }
    .buttons {
      display: flex;
      gap: 4px;
    }
    @media (max-width: 870px) {
      .content {
        grid-template-columns: 1fr;
        margin-bottom: 16px;
      }

      .member-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        grid-gap: 16px;
        gap: 16px;
      }
    }
  `]
})
export class HouseDashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private houseService = inject(HouseService);
  private activityService = inject(FinancialActivityService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  house = signal<House | null>(null);
  activities = signal<FinancialActivity[]>([]);
  protected activityType = FinancialActivityType;

  ngOnInit(): void {
    // Initial load
    const initialId = Number(this.route.snapshot.paramMap.get('id'));
    if (initialId) this.refresh(initialId);

    // Also refresh on every navigation end (covers same-URL navigations)
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) this.refresh(id);
      }
    });
  }

  refresh(houseId: number) {
    this.houseService.getHouseById(houseId).subscribe(h => { this.house.set(h); console.log("en componente:", h); });
    this.activityService.getHouseFinancialActivities(houseId).subscribe(list => {
      const sorted = [...list].sort((a, b) => b.date.getTime() - a.date.getTime());
      this.activities.set(sorted);
    });
  }

  initials(first?: string, last?: string): string {
    const f = (first || '').trim();
    const l = (last || '').trim();
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
  }

  initialsFromName(name?: string): string {
    const n = (name || '').trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    const first = parts[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  openNewExpense() {
    if (!this.house) return;
    const ref = this.dialog.open(NewHouseExpenseDialogComponent, { data: { house: this.house } });
    ref.afterClosed().subscribe(ok => {
      if (ok && this.house) {
        this.snackBar.open('Expense created', 'Close', { duration: 2500 });
        this.refresh(this.house()!.id);
      }
    });
  }

  openInvite() {
    if (!this.house) return;
    const ref = this.dialog.open(InviteMemberDialogComponent, { data: { houseId: this.house()!.id, roomies: this.house()!.members } });
    ref.afterClosed().subscribe(ok => {
      if (ok && this.house) {
        this.snackBar.open('Invitación enviada', 'Cerrar');
        this.refresh(this.house()!.id);
      }
    });
  }

  openSettings() {
    if (!this.house) return;
    const ref = this.dialog.open(PayRatioDialogComponent, {
      data: { houseId: this.house()!.id, members: this.house()!.members }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok && this.house) {
        this.snackBar.open('Ratios actualizados', 'Cerrar', { duration: 2500 });
        this.refresh(this.house()!.id);
      }
    });
  }

}
