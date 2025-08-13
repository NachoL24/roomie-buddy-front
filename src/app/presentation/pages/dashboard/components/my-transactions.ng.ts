import { Component, inject, OnInit, signal, Input } from "@angular/core";
import { FinancialActivityService } from "@application/use-cases";
import { FinancialActivity, FinancialActivityType } from "@domain/entities/financial-activity.entity";
import { Page } from "@domain/entities/page.entity";
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransactionCardComponent } from '@presentation/shared/ui';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { NewTransactionDialogComponent } from "./new-transaction-dialog.ng";
import { MyResumeComponent } from "./my-resume.ng";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-my-transactions",
  standalone: true,
  imports: [
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    TransactionCardComponent,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="transactions-container">
      <div class="transactions-header">
        <div class="header-content">
          <h1 class="title">Últimas Transacciones</h1>
          <mat-icon class="info-icon" matTooltip="Click derecho en una transacción para más opciones">info</mat-icon>
        </div>
        <button class="new-transaction-button" matButton="filled" color="primary" (click)="newTransaction()">Nueva Transacción</button>
      </div>

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
              <app-transaction-card [activity]="activity" (edited)="onEdited()"></app-transaction-card>
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
      margin: 0 auto;
    }

    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      margin-bottom: 12px;
    }

    .header-content {
      display: flex;
      align-items: center;
    }

    .info-icon {
      margin-left: 4px;
      font-size: 15px;
      color: var(--mat-sys-on-surface);
    }

    .title {
      margin:0;
      font-size: 28px;
      font-weight: 500;
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
      gap: 10px;
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

    .transactions-paginator {
      margin-top: 8px;
    }

    @media (max-width: 768px) {
      .transactions-container {
        padding: 12px;
      }
    }

    @media (max-width: 600px) {
      .transactions-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 16px;
      }
      .new-transaction-button {
        width: 100%;
      }
    }
  `]
})
export class MyTransactionsComponent implements OnInit {
  @Input() resumeComponent?: MyResumeComponent;

  activitiesService = inject(FinancialActivityService);
  dialog = inject(MatDialog);
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

  ngOnInit() {
    this.loadFinancialActivities(this.page().page, this.page().pageSize);
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

  onEdited() {
    // Refresh the current page and resume summary after an edit
    this.loadFinancialActivities(this.page().page, this.page().pageSize);
    this.resumeComponent?.loadExpenseSummary();
  }

  newTransaction() {
    const dialogRef = this.dialog.open(NewTransactionDialogComponent, {
      width: '400px',
      data: {
        // Pass any data you need to the dialog here
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar las transacciones
        this.loadFinancialActivities(this.page().page, this.page().pageSize);
        // Actualizar el resumen directamente
        this.resumeComponent?.loadExpenseSummary();
      }
    });
  }
}
