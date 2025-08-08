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
        <mat-card-title class="title">Ingresos</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p class="money">{{ expenses()?.MonthIncome | currency }}</p>
      </mat-card-content>
    </mat-card>
    <mat-card class="card">
      <mat-card-header>
        <div mat-card-avatar class="avatar">
          <mat-icon>payments</mat-icon>
          </div>
        <mat-card-title class="title">Gastos</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p class="money">{{ expenses()?.MonthExpenses | currency }}</p>
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
        <p class="money">{{ expenses()?.totalBalance | currency }}</p>
      </mat-card-content>
    </mat-card>
  }
  `,
  styles: [`
    :host {
      margin-top: 16px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 24px;
      align-items: center;
      justify-content: center;
    }

    .card {
      padding: 2px 0;
      width: 250px;
      height: 110px;
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

    .title {
      padding: 0 !important;
    }
  `]
})
export class MyResumeComponent implements OnInit {
  personalExpensesService = inject(PersonalExpenseRestClient);
  expenses = signal<PersonalExpenseSummary | null>(null);

  ngOnInit() {
    this.personalExpensesService.getPersonalExpenseSummary().subscribe(expenses => {
      console.log(expenses);
      this.expenses.set(expenses);
    });
  }

}
