import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FinancialActivity } from '@domain/entities/financial-activity.entity';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewTransactionDialogComponent } from '../../../pages/dashboard/components/new-transaction-dialog.ng';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionDetailsDialogComponent } from '../transaction-details-dialog/transaction-details-dialog.component';
import { IncomeService, PersonalExpenseService, GlobalUserService } from '../../../..';

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
    <mat-card
      class="transaction-card"
      [class.income]="isIncoming"
      [class.expense]="isOutgoing"
      (click)="openDetails()"
      [matContextMenuTriggerFor]="canEdit ? contextMenu : null">
      <mat-card-content>
        <div class="transaction-content">
          <div class="transaction-icon">
            @if (isIncoming) {
              <mat-icon class="income-icon">trending_up</mat-icon>
            } @else {
              <mat-icon class="expense-icon">trending_down</mat-icon>
            }
          </div>
          <div class="transaction-details">
            <div class="transaction-description">{{ activity.description }}</div>
            @if (activity.personal) {
              <div class="transaction-house-name">Personal</div>
            } @else if (activity.houseName != null) {
              <div class="transaction-house-name">{{ activity.houseName }}</div>
            } @else {
              <div class="transaction-house-name">Compartido</div>
            }
            @if (activity.type === 'settlement') {
              <div class="transaction-counterparty">
                @if (isIncoming && activity.paidByName) {
                  De: {{ activity.paidByName }}
                } @else if (isOutgoing && activity.paidToName) {
                  Para: {{ activity.paidToName }}
                }
              </div>
            }
            <div class="transaction-date">{{ activity.date | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
          <div class="transaction-amount-container">
            <div class="transaction-amount" [class.income-amount]="isIncoming" [class.expense-amount]="isOutgoing">
              {{ isIncoming ? '+' : '-' }}{{ activity.amount | currency:'ARS':'symbol':'1.2-2' }}
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-menu #contextMenu="matMenu">
      <button mat-menu-item (click)="onEdit()" [disabled]="!canEdit">
        <mat-icon>edit</mat-icon>
        Edit
      </button>
      <button mat-menu-item (click)="onDelete()" class="delete-button" [disabled]="!canEdit">
        <mat-icon class="delete-icon">delete</mat-icon>
        Delete
      </button>
    </mat-menu>
  `,
  styles: [`
    .transaction-card {
      transition: all 0.2s ease;
      cursor: pointer;
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
    }

    .transaction-description {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--mat-sys-on-background);
    }

    .transaction-counterparty {
      margin-top: 2px;
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .transaction-date {
      margin-top: 2px;
      font-size: 0.9rem;
      color: var(--mat-sys-on-background);
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
export class TransactionCardComponent implements OnChanges {
  @Input({ required: true }) activity!: FinancialActivity;
  @Output() edited = new EventEmitter<void>();
  private dialog = inject(MatDialog);
  private personalExpenseService = inject(PersonalExpenseService);
  private incomeService = inject(IncomeService);
  private snackBar = inject(MatSnackBar);
  private globalUser = inject(GlobalUserService);

  isIncoming = false;
  isOutgoing = false;

  get canEdit(): boolean {
    // Only allow editing/deleting personal income/expense (no settlements)
    return !!this.activity?.personal && (this.activity.type === 'income' || this.activity.type === 'expense');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activity'] && this.activity) {
      this.computeDirection();
    }
  }

  private computeDirection() {
    const myId = this.globalUser.user()?.id;
    // Reset
    this.isIncoming = false;
    this.isOutgoing = false;

    if (this.activity.type === 'income') {
      this.isIncoming = true;
      return;
    }

    if (this.activity.type === 'expense') {
      this.isOutgoing = true;
      return;
    }

    // Settlement: direction depends on who paid/sent to whom relative to current user
    if (this.activity.type === 'settlement') {
      if (myId && this.activity.paidToId && this.activity.paidToId === myId) {
        this.isIncoming = true;
      } else if (myId && this.activity.paidById && this.activity.paidById === myId) {
        this.isOutgoing = true;
      }
    }
  }

  onEdit() {
    if (!this.canEdit) return;
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
    if (!this.canEdit) return;
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

  openDetails() {
    this.dialog.open(TransactionDetailsDialogComponent, {
      data: { activity: this.activity }
    });
  }
}
