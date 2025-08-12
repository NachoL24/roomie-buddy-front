import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { FinancialActivity, FinancialActivityType } from '@domain/entities';

export interface TransactionDetailsData {
  activity: FinancialActivity;
}

@Component({
  selector: 'app-transaction-details-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    DatePipe,
    NgClass,
  ],
  template: `
    <div class="header">
      <h2>Detalle de transacción</h2>
    </div>

    <div class="content">
      <div class="row">
        <span class="label">Descripción</span>
        <span class="value">{{ data.activity.description || '-' }}</span>
      </div>

      <div class="row">
        <span class="label">Tipo</span>
        <span class="value">{{ typeLabel(data.activity.type) }}</span>
      </div>

      <div class="row">
        <span class="label">Monto</span>
        <span class="value amount" [ngClass]="{
            'expense': data.activity.type === activityType.EXPENSE,
            'income': data.activity.type === activityType.INCOME,
            'settlement': data.activity.type === activityType.SETTLEMENT
          }">
          {{ data.activity.amount | currency:'ARS':'symbol':'1.2-2' }}
        </span>
      </div>

      <div class="row">
        <span class="label">Fecha</span>
        <span class="value">{{ data.activity.date | date:'dd/MM/yyyy HH:mm' }}</span>
      </div>
      @if (data.activity.houseName != null) {
        <div class="row">
          <span class="label">Casa</span>
          <span class="value">{{ data.activity.houseName }}</span>
        </div>
      }

      @if (data.activity.type === activityType.SETTLEMENT) {
        <div class="row">
          <span class="label">De</span>
          <span class="value">{{ data.activity.paidByName || '-' }}</span>
        </div>
        <div class="row">
          <span class="label">Para</span>
          <span class="value">{{ data.activity.paidToName || '-' }}</span>
        </div>
      } @else if (data.activity.type === activityType.EXPENSE && data.activity.paidByName && data.activity.personal == false) {
        <div class="row">
          <span class="label">Pagado por</span>
          <span class="value">{{ data.activity.paidByName }}</span>
        </div>
      }
    </div>

    <div class="actions">
      <button mat-button (click)="close()">Cerrar</button>
    </div>
  `,
  styles: [`
    :host { display: block; max-width: 520px; padding: 8px 8px 16px; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 0 8px; }
    h2 { margin: 0; font-size: 20px; }
    .icon {
      position: relative;
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--mat-sys-surface-variant);
      display:flex; align-items:center; justify-content:center;
    }
    .icon.expense mat-icon { color: var(--mat-sys-primary); }
    .icon.income mat-icon { color: var(--income); }
    .icon.settlement mat-icon { color: var(--mat-sys-primary); }
    .mini-avatar {
      position: absolute; bottom: -6px; width: 24px; height: 24px; border-radius: 50%;
      background: #f0d7cd; color:#6a4a3c; font-weight: 600; display:flex; align-items:center; justify-content:center;
      overflow: hidden; font-size: 10px;
    }
    .mini-avatar.left { left: -4px; }
    .mini-avatar.right { right: -4px; }
    .content { display: grid; gap: 8px; padding: 0 8px; }
    .row { display: grid; grid-template-columns: 120px 1fr; align-items: center; gap: 8px; }
    .label { color: var(--mat-sys-on-surface-variant); font-size: 0.9rem; }
    .value { color: var(--mat-sys-on-surface); font-weight: 500; }
    .amount.income { color: var(--income); }
    .amount.expense, .amount.settlement { color: var(--mat-sys-primary); }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; padding: 0 8px; }
  `]
})
export class TransactionDetailsDialogComponent {
  protected activityType = FinancialActivityType;
  constructor(
    private dialogRef: MatDialogRef<TransactionDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDetailsData
  ) { }

  close() {
    this.dialogRef.close();
  }

  protected initialsFrom(name?: string): string {
    const n = (name || '').trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    const first = parts[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  protected typeLabel(t: FinancialActivityType): string {
    switch (t) {
      case FinancialActivityType.EXPENSE: return 'Gasto';
      case FinancialActivityType.INCOME: return 'Ingreso';
      case FinancialActivityType.SETTLEMENT: return 'Transferencia';
    }
  }
}
