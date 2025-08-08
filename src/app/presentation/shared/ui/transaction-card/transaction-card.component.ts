import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FinancialActivity } from '@domain/entities/financial-activity.entity';

@Component({
    selector: 'app-transaction-card',
    standalone: true,
    imports: [
        CurrencyPipe,
        DatePipe,
        MatCardModule,
        MatIconModule
    ],
    template: `
    <mat-card class="transaction-card" [class.income]="activity.type === 'income'" [class.expense]="activity.type === 'expense'">
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
}
