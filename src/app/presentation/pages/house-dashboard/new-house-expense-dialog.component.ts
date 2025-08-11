import { Component, Inject, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '@application/use-cases';
import { House } from '@domain/entities';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

interface DialogData { house: House; }

@Component({
  selector: 'app-new-house-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDialogModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  template: `
    <h2 mat-dialog-title class="title">Nuevo gasto de casa</h2>
    <div mat-dialog-content class="form">

      <div class="toggle-strip">
        <mat-button-toggle-group class="mode" [(ngModel)]="type">
          <mat-button-toggle value="expense">Gasto</mat-button-toggle>
          <mat-button-toggle value="settlement">Transferencia</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>Descripción</mat-label>
        <input matInput [(ngModel)]="description" required/>
      </mat-form-field>


      <mat-form-field appearance="outline">
        <mat-label>Monto</mat-label>
        <input matInput type="number" min="0" step="0.01" [(ngModel)]="amount" required/>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>{{type() === 'expense' ? 'Pagado por' : 'Transferido por'}}</mat-label>
        <mat-select [(ngModel)]="paidById" required>
          @for (m of data.house.members; track m.id) {
            <mat-option [value]="m.id">
              <div class="option">
                @if (m.picture) {
                  <img class="avatar" [src]="m.picture!" [alt]="m.firstName + ' ' + m.lastName" />
                } @else {
                  <div class="avatar initials">{{ initials(m.firstName, m.lastName) }}</div>
                }
                <span>{{ m.firstName }} {{ m.lastName }}</span>
              </div>
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      @if(type() === 'expense') {

        <div class="row-2">
          <mat-form-field appearance="outline">
            <mat-label>Fecha</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="date" required/>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>


      <div class="custom-toggle">
        <span class="spacer"></span>
        <button matButton="text" type="button" class="toggle-btn" (click)="customSplit = !customSplit">
          <span class="toggle-text">{{ customSplit ? 'División automática' : 'Dividir manualmente' }}</span>
          <mat-icon class="toggle-icon">{{ customSplit ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
        </button>
      </div>

      @if (customSplit) {
        <div class="custom-split">
          <div class="shares">
            @for (s of shares; track s.roomieId) {
              <div class="share-row">
                <div class="user">
                  @if (s.picture) {
                    <img class="avatar" [src]="s.picture!" [alt]="s.firstName + ' ' + s.lastName" />
                  } @else {
                    <div class="avatar initials">{{ initials(s.firstName, s.lastName) }}</div>
                  }
                  <div class="name">{{ s.firstName }} {{ s.lastName }}</div>
                </div>
                <mat-form-field appearance="outline" class="share-input">
                  <mat-label>Monto</mat-label>
                  <input matInput type="number"
                         [min]="0"
                         [(ngModel)]="shares[$index]['amount']"
                         (ngModelChange)="onShareChange($index)"/>
                </mat-form-field>
              </div>
            }
          </div>
        </div>
      }
    } @else if (type() === 'settlement') {
      <mat-form-field appearance="outline">
        <mat-label>Transferido a</mat-label>
        <mat-select [(ngModel)]="paidToId" required>
          @for (m of data.house.members; track m.id) {
            <mat-option [value]="m.id">
              <div class="option">
                @if (m.picture) {
                  <img class="avatar" [src]="m.picture!" [alt]="m.firstName + ' ' + m.lastName" />
                } @else {
                  <div class="avatar initials">{{ initials(m.firstName, m.lastName) }}</div>
                }
                <span>{{ m.firstName }} {{ m.lastName }}</span>
              </div>
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
    }
    </div>
    <div mat-dialog-actions class="actions">
      @if (amount) {
        <div class="summary">
          <div [class.error]="!sharesValid()">
            {{ summaryText()[0] }}
          </div>
          <div [class.error]="!sharesValid()">
            {{ summaryText()[1] }}
          </div>
        </div>
      }
      <span class="spacer"></span>
      <button mat-button (click)="close(false)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="!valid()">Crear</button>
    </div>
  `,
  styles: [`
  .toggle-strip { width: 100%; margin: 8px 0 20px 0; }
  .mode { display: grid; grid-template-columns: 1fr 1fr; width: 100%; gap: 0 !important;}
  .mode .mat-button-toggle { width: 100%; justify-content: center; }
  .mode .mat-button-toggle-label-content { width: 100%; text-align: center; padding: 12px 0; }
      .form { display: flex; flex-direction: column; width: 520px; max-width: 92vw; padding: 0 16px 4px 16px; }
      .first {
        margin-top: 8px;
      }
      .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .custom-toggle {
        display: flex;
        width: 100%;
      }
      .toggle-btn {
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-between;
        padding-right: 4px;
      }
      .toggle-text { text-align: left; }
      .spacer {
          flex: 1 1 auto;
      }
      .custom-split { margin-top: 12px; display: flex; flex-direction: column; gap: 12px; padding-top: 8px; }
      .mode { display: flex; gap: 16px; }
      .shares { display: flex; flex-direction: column; gap: 8px; }
      .share-row { display: grid; grid-template-columns: 1fr 200px auto; align-items: center; gap: 12px; }
      .user { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; margin-left: 12px }
      .avatar { width: 28px; height: 28px; border-radius: 50%; background: #f0d7cd; display: inline-flex; align-items: center; justify-content: center; font-weight: 600; color: #6a4a3c; }
      .avatar.initials { font-size: 12px; }
      .name { font-weight: 500; }
      .option { display: flex; align-items: center; gap: 8px; }
      .share-input { width: 100%; }
      .calc { min-width: 120px; text-align: right; }
      .muted { color: var(--mat-sys-on-surface-variant); }
      .summary { display: flex; flex-direction: column; justify-content: center; align-items: start; }
      .error { color: var(--mat-sys-error); font-weight: 500; }
      .actions {
        padding: 16px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      .title {
        padding-bottom: 4px !important;
      }
      @media (max-width: 540px) {
        .row-2 { grid-template-columns: 1fr; }
        .share-row { grid-template-columns: 1fr; }
      }
    `]
})
export class NewHouseExpenseDialogComponent {
  private dialogRef = inject(MatDialogRef<NewHouseExpenseDialogComponent>);
  private expenseService = inject(ExpenseService);

  description = '';
  amount: number | null = null;
  date: Date = new Date();
  paidById: number | null = null;
  paidToId: number | null = null;
  customSplit = false;
  type = signal<'expense' | 'settlement'>('expense');
  shares: Array<{
    roomieId: number;
    firstName: string;
    lastName: string;
    picture?: string;
    amount: number;
  }> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    // Default payer: first member
    this.paidById = this.data.house.members[0]?.id ?? null;
    // Initialize shares using payRatio as default percentages
    const members = this.data.house.members ?? [];
    const totalPercent = members.reduce((acc, m) => acc + (m.payRatioPercentage ?? m.payRatio * 100), 0);
    this.shares = members.map(m => ({
      roomieId: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      picture: m.picture,
      amount: 0,
      percent: totalPercent > 0 ? (m.payRatioPercentage ?? m.payRatio * 100) : (members.length ? 100 / members.length : 0),
    }));
  }

  valid() {
    if (!this.amount || this.amount <= 0) return false;
    if (!this.date) return false;
    if (!this.paidById) return false;
    if (!this.customSplit) return true;
    return this.sharesValid();
  }

  sharesValid(): boolean {
    if (!this.customSplit) return true;
    const totalAmount = this.shares.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
    return Math.abs(totalAmount - (this.amount || 0)) < 0.5;
  }

  summaryText(): string[] {
    if (!this.amount) return ['', ''];
    if (!this.customSplit) return [`Asignado: ${this.amount.toFixed(2)}`, `Por defecto con porcentajes`];
    const totalAmount = this.shares.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
    const diff = (this.amount || 0) - totalAmount;
    return [`Asignado: ${totalAmount.toFixed(2)}`, `Restante: ${diff.toFixed(2)}`];
  }

  calcAmountFromPercent(percent: number): number {
    const amt = this.amount || 0;
    return Math.round((amt * (Number(percent) || 0)) / 100);
  }

  onShareChange(_index: number) {
    // No-op hook for potential live validations/calculations
  }

  save() {
    const h = this.data.house;
    const payload: any = {
      description: this.description,
      amount: this.amount || 0,
      date: this.date,
      houseId: h.id,
      paidById: this.paidById!,
    };

    if (this.customSplit) {
      const expenseShares = this.buildShares();
      payload.expenseShares = expenseShares;
    }


    console.log("Saving expense with payload:", payload);
    this.expenseService.createExpense(payload).subscribe((response) => {
      console.log("Expense created successfully:", response);
      this.close(true);
    });
  }

  close(ok: boolean) { this.dialogRef.close(ok); }

  private buildShares() {
    const amt = this.amount || 0;
    let remaining = Math.round(amt);
    const result = this.shares.map((s, idx) => {
      const val = Number(s.amount) || 0;
      const shareAmount = idx === this.shares.length - 1 ? remaining : Math.round(val);
      remaining -= shareAmount;
      return { roomieId: s.roomieId, shareAmount };
    });
    return result;
  }

  initials(first?: string, last?: string): string {
    const f = (first || '').trim();
    const l = (last || '').trim();
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
  }
}
