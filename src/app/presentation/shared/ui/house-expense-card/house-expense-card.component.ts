import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { HouseExpense } from '@domain/entities';
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
    <mat-card class="transaction-card expense" [matContextMenuTriggerFor]="contextMenu">
      <mat-card-content>
        <div class="transaction-content">
          <div class="transaction-icon">
            <mat-icon class="expense-icon">trending_down</mat-icon>
          </div>
          <div class="transaction-details">
            <div class="transaction-description">{{ expense.description || '-' }}</div>
            <div class="transaction-date">{{ expense.date | date:'dd/MM/yyyy HH:mm' }}</div>
            <div class="transaction-payer">Pagó: {{ payer }}</div>
          </div>
          <div class="transaction-amount-container">
            <div class="transaction-amount expense-amount">
              -{{ expense.amount | currency:'ARS':'symbol':'1.2-2' }}
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-menu #contextMenu="matMenu">
      <button mat-menu-item (click)="onDelete()" class="delete-button">
        <mat-icon class="delete-icon">delete</mat-icon>
        Eliminar
      </button>
    </mat-menu>
  `,
    styles: [`
    .transaction-card { transition: all 0.2s ease; cursor: pointer; }
    .transaction-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .transaction-card.expense { border-left: 4px solid var(--mat-sys-error); }
    .transaction-content { display: flex; align-items: center; gap: 16px; }
    .transaction-icon { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background-color: var(--mat-sys-surface-variant); }
    .expense-icon { color: var(--mat-sys-error); }
    .transaction-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .transaction-description { font-size: 1.1rem; font-weight: 500; color: var(--mat-sys-on-surface); }
    .transaction-date { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); }
    .transaction-payer { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); }
    .transaction-amount-container { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .transaction-amount { font-size: 1.3rem; font-weight: 600; }
    .expense-amount { color: var(--mat-sys-error); }
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
    @Input({ required: true }) expense!: HouseExpense;
    @Input({ required: true }) payer!: string;
    @Output() deleted = new EventEmitter<void>();

    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private expenseService = inject(ExpenseService);

    onDelete() {
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
            this.expenseService.deleteExpense(this.expense.id).subscribe({
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
