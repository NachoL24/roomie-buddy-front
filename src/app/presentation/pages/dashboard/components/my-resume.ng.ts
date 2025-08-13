import { Component, inject, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { PersonalExpenseRestClient } from "@infra/rest-clients";
import { PersonalExpenseSummary } from "../../../..";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CurrencyPipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-my-resume",
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, CurrencyPipe, MatIconModule],
  template: `
  @if (expenses() === null) {
    <mat-progress-spinner
      mode="indeterminate"
    ></mat-progress-spinner>
  } @else {
    <mat-card class="card">
      <mat-card-header>
        <div mat-card-avatar class="avatar">
          <mat-icon>account_balance_wallet</mat-icon>
          </div>
        <mat-card-title class="title">Ingresos de este mes</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p class="money income">{{ expenses()?.MonthIncome | currency }}</p>
      </mat-card-content>
    </mat-card>
    <mat-card class="card">
      <mat-card-header>
        <div mat-card-avatar class="avatar">
          <mat-icon>payments</mat-icon>
          </div>
        <mat-card-title class="title">Gastos de este mes</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p class="money expense">{{ expenses()?.MonthExpenses | currency }}</p>
      </mat-card-content>
    </mat-card>
    <mat-card class="card">
      <mat-card-header>
        <div mat-card-avatar class="avatar">
          <mat-icon>account_balance</mat-icon>
          </div>
        <mat-card-title class="title">Saldo Total</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p class="money total">{{ expenses()?.totalBalance | currency }}</p>
      </mat-card-content>
    </mat-card>
  }
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      grid-gap: 16px;
      gap: 16px;
      align-items: center;
      justify-content: center;
    }

    .card {
      padding: 2px 0;
      width: 100%;
      height: 110px;
      transition: all 0.2s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .avatar {
      width: 32px;
      height: 24px;
    }

    .money {
      margin: 5px;
      font-size: 24px;
      font-weight: bold;
      color: var(--mat-sys-primary);
    }

    .income {
      color: var(--income);
    }

    .expense {
      color: var(--mat-sys-error);
    }

    .total {
      color: var(--mat-sys-primary);
    }

    .title {
      padding: 0 !important;
    }
  `]
})
export class MyResumeComponent implements OnInit {
  personalExpensesService = inject(PersonalExpenseRestClient);
  expenses = signal<PersonalExpenseSummary | null>(null);

  ngOnInit() {
    this.loadExpenseSummary();
  }

  public loadExpenseSummary() {
    this.personalExpensesService.getPersonalExpenseSummary().subscribe(expenses => {
      console.log(expenses);
      this.expenses.set(expenses);
    });
  }

}
