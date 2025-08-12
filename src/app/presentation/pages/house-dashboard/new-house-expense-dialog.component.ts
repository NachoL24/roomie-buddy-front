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
import { ExpenseService, SettlementService } from '@application/use-cases';
import { FinancialActivityType, House } from '@domain/entities';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

interface DialogData {
  house: House;
  // For expenses: pass only the id and the type for edit
  expenseId?: number;
  activityType?: FinancialActivityType;
  // For settlements: still passing full activity for now
  activity?: { id: number; type: FinancialActivityType; description: string; amount: number; date: Date; paidById?: number; paidToId?: number; };
}

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

      @if (!isEdit) {
        <div class="toggle-strip">
          <mat-button-toggle-group class="mode" [(ngModel)]="type">
            <mat-button-toggle value="expense">Gasto</mat-button-toggle>
            <mat-button-toggle value="settlement">Transferencia</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      }

      <mat-form-field appearance="outline" class="first">
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

      @if (type() === 'settlement') {
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

      <div class="row-2">
        <mat-form-field appearance="outline">
          <mat-label>Fecha</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="date" required />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Horario</mat-label>
          <input matInput type="time" [(ngModel)]="time" required />
        </mat-form-field>
      </div>
      @if(type() === 'expense') {


      @if (!isEdit) {
      <div class="custom-toggle">
        <span class="spacer"></span>
        <button matButton="text" type="button" class="toggle-btn" (click)="customSplit = !customSplit">
          <span class="toggle-text">{{ customSplit ? 'División automática' : 'Dividir manualmente' }}</span>
          <mat-icon class="toggle-icon">{{ customSplit ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</mat-icon>
        </button>
      </div>
      }

      @if (customSplit || isEdit) {
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
      <button mat-flat-button color="primary" (click)="save()" [disabled]="!valid()">{{isEdit ? 'Actualizar' : 'Crear'}}</button>
    </div>
  `,
  styles: [`
  .toggle-strip { width: 100%; margin: 8px 0 12px 0; }
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
  private settlementService = inject(SettlementService);

  description = '';
  amount: number | null = null;
  date: Date = new Date();
  time: string = '';
  paidById: number | null = null;
  paidToId: number | null = null;
  customSplit = false;
  type = signal<'expense' | 'settlement'>('expense');
  isEdit = false;
  editId: number | null = null;
  shares: Array<{
    roomieId: number;
    firstName: string;
    lastName: string;
    picture?: string;
    amount: number;
  }> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    // If editing an expense via id, fetch details (with shares) first
    if (this.data.expenseId) {
      this.isEdit = true;
      this.editId = this.data.expenseId;
      this.type.set('expense');
      this.expenseService.getExpenseById(this.data.expenseId).subscribe(exp => {
        this.description = exp.description || '';
        this.amount = exp.amount;
        this.date = new Date(exp.date);
        const hh = String(this.date.getHours()).padStart(2, '0');
        const mm = String(this.date.getMinutes()).padStart(2, '0');
        this.time = `${hh}:${mm}`;
        this.paidById = exp.paidById;
        // Prefill shares for editing
        if (exp.expenseShares?.length) {
          this.customSplit = true;
          const sharesMap = new Map(exp.expenseShares.map(s => [s.roomieId, s.shareAmount]));
          this.shares = (this.data.house.members ?? []).map(m => ({
            roomieId: m.id,
            firstName: m.firstName,
            lastName: m.lastName,
            picture: m.picture,
            amount: sharesMap.get(m.id) ?? 0
          }));
        }
      });
    } else if (this.data.activity) {
      // Settlement edit path (still passing full activity)
      const a = this.data.activity;
      this.isEdit = true;
      this.editId = a.id;
      this.description = a.type === FinancialActivityType.SETTLEMENT ? (a.description.split(':')[1]?.trim() || '') : a.description;
      this.amount = a.amount;
      this.date = new Date(a.date);
      const hh = String(this.date.getHours()).padStart(2, '0');
      const mm = String(this.date.getMinutes()).padStart(2, '0');
      this.time = `${hh}:${mm}`;
      this.paidById = a.paidById ?? null;
      this.paidToId = a.paidToId ?? null;
      this.type.set('settlement');
    }
    // Initialize default shares only if not prefilled by fetch
    if (!this.shares.length) {
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

    // Initialize time from current date
    if (!this.time) {
      const now = this.date;
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      this.time = `${hh}:${mm}`;
    }
  }

  valid() {
    if (!this.amount || this.amount <= 0) return false;
    if (!this.paidById) return false;
    // Settlement-specific validation (no date/time required for create; we still collect date/time)
    if (this.type() === 'settlement') {
      if (!this.paidToId || !!!this.amount || this.amount <= 0 || !this.paidById) return false;
      if (this.paidToId === this.paidById) return false;
      return true;
    }
    // Expense-specific validation
    if (!this.date || !this.time) return false;
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
    // If creating a settlement (transfer), call settlements endpoint
    // Combine date + time into a single Date instance
    const dateTime = new Date(this.date);
    if (this.time) {
      const [th, tm] = this.time.split(':').map(v => parseInt(v, 10));
      if (!Number.isNaN(th) && !Number.isNaN(tm)) {
        dateTime.setHours(th, tm, this.date.getSeconds(), this.date.getMilliseconds());
      }
    }
    if (this.type() === 'settlement') {
      if (this.isEdit && this.editId) {
        // Send only changed fields
        const updatePayload: any = {};
        if (this.description) updatePayload.description = this.description;
        if (this.amount) updatePayload.amount = this.amount;
        if (this.paidById) updatePayload.fromRoomieId = this.paidById;
        if (this.paidToId) updatePayload.toRoomieId = this.paidToId;
        if (this.date && this.time) updatePayload.date = dateTime;

        console.log('Updating settlement with payload:', updatePayload);
        this.settlementService.updateSettlement(this.editId, updatePayload).subscribe((response) => {
          console.log('Settlement updated successfully:', response);
          this.close(true);
        });
      } else {
        const payload = {
          fromRoomieId: this.paidById!,
          toRoomieId: this.paidToId!,
          amount: this.amount || 0,
          houseId: h.id,
          description: this.description || '',
          date: dateTime
        };

        console.log('Saving settlement with payload:', payload);
        this.settlementService.createSettlement(payload).subscribe((response) => {
          console.log('Settlement created successfully:', response);
          this.close(true);
        });
      }
      return;
    }
    const payload: any = {
      description: this.description,
      amount: this.amount || 0,
      date: dateTime,
      houseId: h.id,
      paidById: this.paidById!,
    };

    if (this.customSplit) {
      const expenseShares = this.buildShares();
      payload.expenseShares = expenseShares;
    }


    if (this.isEdit && this.editId) {
      console.log('Updating expense with payload:', payload);
      this.expenseService.updateExpense(this.editId, payload).subscribe((response) => {
        console.log('Expense updated successfully:', response);
        this.close(true);
      });
    } else {
      console.log('Saving expense with payload:', payload);
      this.expenseService.createExpense(payload).subscribe((response) => {
        console.log('Expense created successfully:', response);
        this.close(true);
      });
    }
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
