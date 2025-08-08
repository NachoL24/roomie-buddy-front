import { Component, inject, OnInit, signal } from "@angular/core";
import { FinancialActivityService } from "@application/use-cases";
import { FinancialActivity, FinancialActivityType } from "@domain/entities/financial-activity.entity";
import { Page } from "@domain/entities/page.entity";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: "app-my-transactions",
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="transactions-container">
      <h1 class="title">Últimas Transacciones</h1>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Cargando transacciones...</p>
        </div>
      }
      @else {
        @if (page().items.length > 0) {
          <div class="transactions-list">
            @for (activity of page().items; track activity.id) {
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
                      <!-- <mat-chip class="transaction-type" [class.income-chip]="activity.type === 'income'" [class.expense-chip]="activity.type === 'expense'">
                        {{ activity.type === 'income' ? 'Ingreso' : 'Gasto' }}
                      </mat-chip> -->
                      <div class="transaction-amount" [class.income-amount]="activity.type === 'income'" [class.expense-amount]="activity.type === 'expense'">
                        {{ activity.type === 'income' ? '+' : '-' }}{{ activity.amount | currency:'ARS':'symbol':'1.2-2' }}
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>

          <mat-paginator
            [length]="page().totalCount"
            [pageSize]="page().pageSize"
            [pageIndex]="page().page - 1"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons
            class="transactions-paginator">
          </mat-paginator>
        }
        @else {
          <div class="empty-state">
            <mat-icon class="empty-icon">receipt_long</mat-icon>
            <h3>No hay transacciones</h3>
            <p>No se encontraron transacciones para mostrar.</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 16px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .title {
      font-size: 28px;
      font-weight: 500;
      margin-bottom: 24px;
      color: var(--mat-sys-on-surface);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: var(--mat-sys-on-surface-variant);
    }

    .loading-container p {
      margin-top: 16px;
      font-size: 16px;
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

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

    .transaction-type {
      font-size: 12px;
      font-weight: 500;
    }

    .income-chip {
      background-color: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-on-tertiary-container);
    }

    .expense-chip {
      background-color: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
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

    .transactions-paginator {
      margin-top: 24px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 500;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    mat-paginator {
      margin-top: 8px !important;
    }

    @media (max-width: 768px) {
      .transactions-container {
        padding: 12px;
      }

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
export class MyTransactionsComponent implements OnInit {
  activitiesService = inject(FinancialActivityService);
  loading = signal(false);
  page = signal<Page<FinancialActivity>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  constructor() { }

  ngOnInit() {
    this.loadFinancialActivities(1, 10);
  }

  onPageChange(event: PageEvent) {
    this.loadFinancialActivities(event.pageIndex + 1, event.pageSize);
  }

  private loadFinancialActivities(page: number = 1, pageSize: number = 10) {
    this.loading.set(true);
    this.activitiesService.getFinancialActivities({ page, pageSize }).subscribe({
      next: (result) => {
        this.page.set(result);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching financial activities:', error);
        this.loading.set(false);
      }
    });
  }
}
