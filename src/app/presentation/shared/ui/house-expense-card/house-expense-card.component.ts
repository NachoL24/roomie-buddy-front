import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FinancialActivity, FinancialActivityType, House } from '@domain/entities';
import { ExpenseService, SettlementService } from '@application/use-cases';
import { NewHouseExpenseDialogComponent } from '@presentation/pages/house-dashboard/new-house-expense-dialog.component';
import { TransactionDetailsDialogComponent } from '@presentation/shared/ui/transaction-details-dialog/transaction-details-dialog.component';

@Component({
  selector: 'app-house-expense-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    NgOptimizedImage
  ],
  template: `
  <mat-card class="transaction-card" (click)="openDetails()" [class.expense]="activity.type === activityType.EXPENSE" [class.settlement]="activity.type === activityType.SETTLEMENT" [matContextMenuTriggerFor]="contextMenu">
      <mat-card-content>
        <div class="transaction-content">
          <div class="transaction-left">
            <div class="transaction-icon">
              <mat-icon [class.expense-icon]="activity.type === activityType.EXPENSE" [class.settlement-icon]="activity.type === activityType.SETTLEMENT">
                {{ activity.type === activityType.EXPENSE ? 'trending_down' : 'swap_horiz' }}
              </mat-icon>
              @if (activity.paidByPicture) {
                <img class="payer-avatar" [ngSrc]="activity.paidByPicture!" width="24" height="24" alt="payer" alt="avatar" loading="eager" fetchpriority="high" decoding="async"/>
              } @else if (activity.paidByName) {
                <span class="payer-avatar initials">{{ payerInitials() }}</span>
              }
              @if (activity.type === activityType.SETTLEMENT && activity.paidToPicture) {
                <img class="paid-avatar" [ngSrc]="activity.paidToPicture!" width="24" height="24" alt="receiver" alt="avatar" loading="eager" fetchpriority="high" decoding="async"/>
              }
            </div>
          </div>
          <div class="transaction-details">
            <div class="transaction-description">{{ activity.description || '-' }}</div>
            @if (activity.paidByName) {
              <span class="payer-name"> {{ activity.paidByName }}</span>
            }
            <div class="transaction-date">{{ activity.date | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
          <div class="transaction-amount-container">
            <div class="transaction-amount" [class.expense-amount]="activity.type === activityType.EXPENSE" [class.settlement-amount]="activity.type === activityType.SETTLEMENT">
              {{ activity.amount | currency:'ARS':'symbol':'1.2-2' }}
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-menu #contextMenu="matMenu">
      <button mat-menu-item (click)="onEdit()" class="edit-button">
        <mat-icon class="edit-icon">edit</mat-icon>
        Editar
      </button>
      <button mat-menu-item (click)="onDelete()" class="delete-button">
        <mat-icon class="delete-icon">delete</mat-icon>
        Eliminar
      </button>

    </mat-menu>
  `,
  styles: [`
    .transaction-card { transition: all 0.2s ease; cursor: pointer; }
    .transaction-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .transaction-card.expense, .transaction-card.settlement { border-left: 4px solid var(--mat-sys-primary); }
    .transaction-content { display: flex; align-items: center; gap: 16px; }
  .transaction-left { display: flex; align-items: center; gap: 10px; height: 60px; }
  .transaction-icon {
  position: relative; /* clave para que el avatar se posicione dentro de este bloque */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--mat-sys-surface-variant);
}
    .expense-icon, .settlement-icon { color: var(--mat-sys-primary); }
    .transaction-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .transaction-description { font-size: 1.1rem; font-weight: 500; color: var(--mat-sys-on-surface); }
    .transaction-date { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); }
    .transaction-payer { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); display: flex; align-items: center; gap: 6px; }
    .payer { display: inline-flex; align-items: center; gap: 8px; }
    .payer-avatar {
  width: 24px; /* más pequeño que el icono */
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0d7cd;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6a4a3c;
  position: absolute;
  bottom: -8px;
  left: -2px;
}
.paid-avatar {
  width: 24px; /* más pequeño que el icono */
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0d7cd;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6a4a3c;
  position: absolute;
  bottom: -8px;
  right: -2px;
}
    .payer-avatar.initials { font-size: 10px; }
    .payer-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .payer-name { color: var(--mat-sys-on-surface); font-weight: 500; }
    .transaction-amount-container { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .transaction-amount { font-size: 1.3rem; font-weight: 600; }
    .expense-amount, .settlement-amount { color: var(--mat-sys-primary); }
    .delete-button, .delete-icon { color: var(--mat-sys-error); }
    .delete-button:hover { background-color: var(--mat-sys-on-error); }
    @media (max-width: 768px) {
      .transaction-content { gap: 12px; }
      .transaction-icon { width: 40px; height: 40px; }
      .transaction-description { font-size: 14px; }
      .transaction-amount { font-size: 16px; }
    }
  `]
})
export class HouseExpenseCardComponent {
  @Input({ required: true }) activity!: FinancialActivity;
  @Input({ required: true }) house!: House;
  @Output() deleted = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  protected activityType = FinancialActivityType;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private expenseService = inject(ExpenseService);
  private settlementService = inject(SettlementService);

  payerInitials(): string {
    return this.initialsFrom(this.activity.paidByName);
  }

  initialsFrom(name?: string): string {
    const n = (name || '').trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    const first = parts[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  onDelete() {
    const isExpense = this.activity.type === FinancialActivityType.EXPENSE;
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: isExpense ? 'Eliminar gasto' : 'Eliminar transferencia',
        message: isExpense ? '¿Querés eliminar este gasto? Esta acción no se puede deshacer.' : '¿Querés eliminar esta transferencia? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const request$ = isExpense
        ? this.expenseService.deleteExpense(this.activity.id)
        : this.settlementService.deleteSettlement(this.activity.id);

      request$.subscribe({
        next: () => {
          this.snackBar.open(isExpense ? 'Gasto eliminado' : 'Transferencia eliminada', 'Cerrar', { duration: 2500 });
          this.deleted.emit();
        },
        error: (error) => {
          console.error('Error deleting transaction', error);
          this.snackBar.open('Error al eliminar la transacción', 'Cerrar', { duration: 3000 });
        }
      });
    });
  }

  onEdit() {
    const isExpense = this.activity.type === FinancialActivityType.EXPENSE;
    const data = isExpense
      ? { house: this.house, expenseId: this.activity.id, activityType: this.activity.type }
      : { house: this.house, activity: this.activity };
    const ref = this.dialog.open(NewHouseExpenseDialogComponent, { data });

    ref.afterClosed().subscribe(ok => {
      if (ok) {
        this.snackBar.open('Transacción actualizada', 'Cerrar', { duration: 2500 });
        this.updated.emit();
      }
    });
  }

  openDetails() {
    this.dialog.open(TransactionDetailsDialogComponent, {
      data: { activity: this.activity }
    });
  }
}
