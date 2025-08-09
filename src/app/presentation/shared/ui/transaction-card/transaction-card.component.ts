import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FinancialActivity } from '@domain/entities/financial-activity.entity';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewTransactionDialogComponent } from '../../../pages/dashboard/components/new-transaction-dialog.ng';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IncomeService, PersonalExpenseService } from '../../../..';

@Component({
  selector: 'app-transaction-card',
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
    <mat-card class="transaction-card" [class.income]="activity.type === 'income'" [class.expense]="activity.type === 'expense'" [matContextMenuTriggerFor]="contextMenu">
      <mat-card-content>
        <div class="transaction-content">
          <div class="transaction-icon">
            @if (activity.type === 'income') {
              <mat-icon class="income-icon">trending_up</mat-icon>
            } @else {
              <mat-icon class="expense-icon">trending_down</mat-icon>
            }
          </div>
          <div class="transaction-details">
            <div class="transaction-description">{{ activity.description }}</div>
            <div class="transaction-date">{{ activity.date | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
          <div class="transaction-amount-container">
            <div class="transaction-amount" [class.income-amount]="activity.type === 'income'" [class.expense-amount]="activity.type === 'expense'">
              {{ activity.type === 'income' ? '+' : '-' }}{{ activity.amount | currency:'ARS':'symbol':'1.2-2' }}
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-menu #contextMenu="matMenu">
      <button mat-menu-item (click)="onEdit()">
        <mat-icon>edit</mat-icon>
        Edit
      </button>
      <button mat-menu-item (click)="onDelete()" class="delete-button">
        <mat-icon class="delete-icon">delete</mat-icon>
        Delete
      </button>
    </mat-menu>
  `,
  styles: [`
    .transaction-card {
      transition: all 0.2s ease;
      cursor: pointer;
      margin-bottom: 12px;
    }

    .transaction-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .transaction-card.income {
      border-left: 4px solid var(--income);
    }

    .transaction-card.expense {
      border-left: 4px solid var(--mat-sys-error);
    }

    .transaction-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .transaction-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--mat-sys-surface-variant);
    }

    .income-icon {
      color: var(--income);
    }

    .expense-icon {
      color: var(--mat-sys-error);
    }

    .transaction-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .transaction-description {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .transaction-date {
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .transaction-amount-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    .transaction-amount {
      font-size: 1.3rem;
      font-weight: 600;
    }

    .income-amount {
      color: var(--income);
    }

    .expense-amount {
      color: var(--mat-sys-error);
    }

    .delete-button, .delete-icon {
      color: var(--mat-sys-error);
    }

    .delete-button:hover {
      background-color: var(--mat-sys-on-error);
    }

    @media (max-width: 768px) {
      .transaction-content {
        gap: 12px;
      }

      .transaction-icon {
        width: 40px;
        height: 40px;
      }

      .transaction-description {
        font-size: 14px;
      }

      .transaction-amount {
        font-size: 16px;
      }
    }
  `]
})
export class TransactionCardComponent {
  @Input({ required: true }) activity!: FinancialActivity;
  @Output() edited = new EventEmitter<void>();
  private dialog = inject(MatDialog);
  private personalExpenseService = inject(PersonalExpenseService);
  private incomeService = inject(IncomeService);
  private snackBar = inject(MatSnackBar);

  onEdit() {
    const ref = this.dialog.open(NewTransactionDialogComponent, {
      data: { activity: this.activity }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        // Parent can refresh the list
        this.edited.emit();
      }
    });
  }

  onDelete() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar transacción',
        message: `¿Querés eliminar este ${this.activity.type === 'income' ? 'ingreso' : 'gasto'}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      if (this.activity.type === 'expense') {
        this.personalExpenseService.deletePersonalExpense(this.activity.id).subscribe({
          next: () => {
            this.snackBar.open('Gasto eliminado', 'Cerrar', { duration: 2500 });
            this.edited.emit();
          },
          error: (error) => {
            console.error('Error deleting expense', error);
            this.snackBar.open('Error al eliminar el gasto', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        this.incomeService.deleteIncome(this.activity.id).subscribe({
          next: () => {
            this.snackBar.open('Ingreso eliminado', 'Cerrar', { duration: 2500 });
            this.edited.emit();
          },
          error: (error) => {
            console.error('Error deleting income', error);
            this.snackBar.open('Error al eliminar el ingreso', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}
