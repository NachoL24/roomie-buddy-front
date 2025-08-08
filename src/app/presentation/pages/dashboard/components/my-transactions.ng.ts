import { Component, inject, OnInit, signal } from "@angular/core";
import { FinancialActivityService } from "@application/use-cases";
import { FinancialActivity } from "../../../..";
import { Page } from "@domain/entities/page.entity";
import { CurrencyPipe } from "@angular/common";

@Component({
  selector: "app-my-transactions",
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <h1 class="title">Ultimas Transacciones</h1>
    <div class="transactions-list">
      @if (page().items.length > 0) {
        @for (activity of page().items; track activity.id) {
          <div class="transaction-item">
            <p class="transaction-description">{{ activity.description }}</p>
            <p class="transaction-amount">{{ activity.amount | currency }}</p>
          </div>
        }
      }
      @else {
        <p class="no-transactions">No hay transacciones recientes.</p>
      }
    </div>
  `,
  styles: [`
    .title {
      font-size: 24px;
      margin-top: 6px;
    }
  `]
})
export class MyTransactionsComponent implements OnInit {
  activitiesService = inject(FinancialActivityService);
  page = signal<Page<FinancialActivity>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  constructor() {}

  ngOnInit() {
    this.loadRecentActivities();
  }

  private loadRecentActivities() {
    this.activitiesService.getFinancialActivities().subscribe({
      next: (page) => {
        this.page.set(page);
      },
      error: (error) => {
        console.error('Error fetching recent activities:', error);
      }
    });
  }



}
