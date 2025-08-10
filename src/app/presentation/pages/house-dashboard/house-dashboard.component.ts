import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HouseService, ExpenseService } from '@application/use-cases';
import { House, HouseExpense } from '@domain/entities';
import { HouseExpenseCardComponent } from '@presentation/shared/ui/house-expense-card/house-expense-card.component';
import { NewHouseExpenseDialogComponent } from '@presentation/pages/house-dashboard/new-house-expense-dialog.component';
import { InviteMemberDialogComponent } from '@presentation/pages/house-dashboard/invite-member-dialog.component';

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
          @if (expenses().length) {
            <div class="card-list">
              @for (ex of expenses(); track ex.id) {
                <app-house-expense-card
                  [expense]="ex"
                  [payer]="payerName(ex.paidById)"
                  [payerPicture]="payerPicture(ex.paidById)"
                  (deleted)="refresh(house()!.id)"
                />
              }
            </div>
          } @else {
            <div class="empty">No transactions yet</div>
          }
        </section>

        <aside class="members">
          <div class="header">
            <h2 class="table-title">Members</h2>
            <button matIconButton color="primary" (click)="openInvite()">
              <mat-icon>add</mat-icon>
            </button>
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
    .empty { padding: 24px; color: var(--mat-sys-on-surface-variant); border: 1px dashed var(--mat-sys-outline-variant); border-radius: 12px; }
    .members { display: flex; flex-direction: column; }
    .member-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
    .member-item { display: flex; gap: 12px; align-items: center; padding: 8px; border-radius: 12px; border: 1px solid var(--mat-sys-outline-variant); }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #f0d7cd; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #6a4a3c; }
    .info .name { font-weight: 600; }
    .text-muted { color: var(--mat-sys-on-surface-variant); margin-top: 2px; font-size: 12px; }
    .invite { width: 100%; }
    .loading { color: var(--mat-sys-on-surface-variant); }
    @media (max-width: 870px) {
      .content {
        grid-template-columns: 1fr;
        margin-bottom: 16px;
      }
    }
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

  refresh(houseId: number) {
    this.houseService.getHouseById(houseId).subscribe(h => { this.house.set(h); console.log("en componente:", h); });
    this.expenseService.getHouseExpenses(houseId).subscribe(ex => this.expenses.set(ex));
  }

  payerName(roomieId: number): string {
    const m = this.house()?.members.find(x => x.id === roomieId);
    return m ? `${m.firstName} ${m.lastName}` : '—';
  }

  payerPicture(roomieId: number): string | undefined {
    return this.house()?.members.find(x => x.id === roomieId)?.picture;
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
