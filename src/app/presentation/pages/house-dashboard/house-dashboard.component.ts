import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HouseService, ExpenseService } from '@application/use-cases';
import { House, HouseExpense } from '@domain/entities';
import { NewHouseExpenseDialogComponent } from '@presentation/pages/house-dashboard/new-house-expense-dialog.component';
import { InviteMemberDialogComponent } from '@presentation/pages/house-dashboard/invite-member-dialog.component';

@Component({
  selector: 'app-house-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
  @if (house()) {
    <div class="house-dashboard">
        <h1>{{ house()?.name }}</h1>

      <div class="content">
        <section class="transactions">
          <div class="header">
            <h2>Transacciones</h2>
            <button mat-stroked-button color="primary" (click)="openNewExpense()">
              <mat-icon>add</mat-icon>
              New Expense
            </button>
          </div>
          @if (expenses() && expenses().length) {
          <div class="table-wrapper">
            <table class="tx-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Payer</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ex of expenses()">
                  <td>{{ ex.description || '-' }}</td>
                  <td>{{ ex.amount | currency:'USD':'symbol' }}</td>
                  <td>{{ payerName(ex.paidById) }}</td>
                  <td>{{ ex.date | date:'yyyy-MM-dd' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
            }
            @else {
              <ng-template #emptyTx>
                <div class="empty">No transactions yet</div>
              </ng-template>
            }
        </section>

        <aside class="members">
          <h2>Members</h2>
          <ul class="member-list">
            <li *ngFor="let m of house()?.members" class="member-item">
              <div class="avatar">{{ initials(m.firstName, m.lastName) }}</div>
              <div class="info">
                <div class="name">{{ m.firstName }} {{ m.lastName }}</div>
                <div class="email text-muted">Ratio: {{ m.payRatioPercentage || (m.payRatio * 100) || 0 }}%</div>
              </div>
            </li>
          </ul>
          <button mat-stroked-button class="invite" (click)="openInvite()">Invite</button>
        </aside>
      </div>
    </div>
          } @else {
            <div class="loading">Loading...</div>
          }
  `,
  styles: [`
    :host { display: block; }
    .house-dashboard { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    h1 { font-size: 32px; margin: 0; }
    .content { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
    .transactions h2, .members h2 { margin: 0 0 8px; }
    .table-wrapper { background: var(--mat-sys-surface); border-radius: 12px; overflow: hidden; border: 1px solid var(--mat-sys-outline-variant); }
    table.tx-table { width: 100%; border-collapse: collapse; }
    .tx-table th, .tx-table td { padding: 14px 16px; border-bottom: 1px solid var(--mat-sys-outline-variant); text-align: left; }
    .tx-table thead th { background: var(--mat-sys-surface-variant); }
    .empty { padding: 24px; color: var(--mat-sys-on-surface-variant); border: 1px dashed var(--mat-sys-outline-variant); border-radius: 12px; }
    .members { display: flex; flex-direction: column; gap: 12px; }
    .member-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
    .member-item { display: flex; gap: 12px; align-items: center; padding: 8px; border-radius: 12px; border: 1px solid var(--mat-sys-outline-variant); }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #f0d7cd; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #6a4a3c; }
    .info .name { font-weight: 600; }
    .text-muted { color: var(--mat-sys-on-surface-variant); font-size: 12px; }
    .invite { width: 100%; }
    .loading { color: var(--mat-sys-on-surface-variant); }
  `]
})
export class HouseDashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private houseService = inject(HouseService);
  private expenseService = inject(ExpenseService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  house = signal<House | null>(null);
  expenses = signal<HouseExpense[]>([]);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const houseId = Number(idParam);
    if (!houseId) return;

    this.refresh(houseId);
  }

  private refresh(houseId: number) {
    this.houseService.getHouseById(houseId).subscribe(h => this.house.set(h));
    this.expenseService.getHouseExpenses(houseId).subscribe(ex => this.expenses.set(ex));
  }

  payerName(roomieId: number): string {
    const m = this.house()?.members.find(x => x.id === roomieId);
    return m ? `${m.firstName} ${m.lastName}` : '—';
  }

  initials(first?: string, last?: string): string {
    const f = (first || '').trim();
    const l = (last || '').trim();
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
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
    const ref = this.dialog.open(InviteMemberDialogComponent, { data: { houseId: this.house()!.id } });
    ref.afterClosed().subscribe(ok => {
      if (ok && this.house) {
        this.snackBar.open('Invitation sent', 'Close', { duration: 2500 });
        this.refresh(this.house()!.id);
      }
    });
  }
}
