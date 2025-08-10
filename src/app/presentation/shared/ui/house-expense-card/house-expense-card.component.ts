import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FinancialActivity, FinancialActivityType } from '@domain/entities';
import { ExpenseService } from '@application/use-cases';

@Component({
  selector: 'app-house-expense-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <mat-card class="transaction-card" [class.expense]="activity.type === activityType.EXPENSE" [class.settlement]="activity.type === activityType.SETTLEMENT" [matContextMenuTriggerFor]="contextMenu">
      <mat-card-content>
        <div class="transaction-content">
          <div class="transaction-left">
            <div class="transaction-icon">
              <mat-icon [class.expense-icon]="activity.type === activityType.EXPENSE" [class.settlement-icon]="activity.type === activityType.SETTLEMENT">
                {{ activity.type === activityType.EXPENSE ? 'trending_down' : 'account_balance' }}
              </mat-icon>
              @if (activity.paidByPicture) {
                <img class="payer-avatar" [src]="activity.paidByPicture" alt="payer" />
              } @else if (activity.paidByName) {
                <span class="payer-avatar initials">{{ payerInitials() }}</span>
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
      <button mat-menu-item *ngIf="activity.type === activityType.EXPENSE" (click)="onDelete()" class="delete-button">
        <mat-icon class="delete-icon">delete</mat-icon>
        Eliminar
      </button>
    </mat-menu>
  `,
  styles: [`
    .transaction-card { transition: all 0.2s ease; cursor: pointer; }
    .transaction-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .transaction-card.expense { border-left: 4px solid var(--mat-sys-primary); }
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
    .expense-icon { color: var(--mat-sys-error); }
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
    .payer-avatar.initials { font-size: 10px; }
    .payer-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .payer-name { color: var(--mat-sys-on-surface); font-weight: 500; }
    .transaction-amount-container { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .transaction-amount { font-size: 1.3rem; font-weight: 600; }
    .expense-amount { color: var(--mat-sys-primary); }
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
  @Output() deleted = new EventEmitter<void>();

  protected activityType = FinancialActivityType;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private expenseService = inject(ExpenseService);

  payerInitials(): string {
    const name = (this.activity.paidByName || '').trim();
    if (!name) return '';
    const parts = name.split(/\s+/);
    return (parts[0]?.[0] || '').concat(parts[1]?.[0] || '').toUpperCase();
  }

  onDelete() {
    if (this.activity.type !== FinancialActivityType.EXPENSE) return;
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar gasto',
        message: '¿Querés eliminar este gasto? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.expenseService.deleteExpense(this.activity.id).subscribe({
        next: () => {
          this.snackBar.open('Gasto eliminado', 'Cerrar', { duration: 2500 });
          this.deleted.emit();
        },
        error: (error) => {
          console.error('Error deleting house expense', error);
          this.snackBar.open('Error al eliminar el gasto', 'Cerrar', { duration: 3000 });
        }
      });
    });
  }
}
