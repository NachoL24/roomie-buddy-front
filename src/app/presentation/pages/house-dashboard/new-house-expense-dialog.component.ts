import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseService } from '@application/use-cases';
import { House } from '@domain/entities';

interface DialogData { house: House; }

@Component({
    selector: 'app-new-house-expense-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>New Expense</h2>
    <div mat-dialog-content class="form">
      <mat-form-field appearance="fill">
        <mat-label>Description</mat-label>
        <input matInput [(ngModel)]="description">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Amount</mat-label>
        <input matInput type="number" [(ngModel)]="amount">
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">Cancel</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="!valid()">Create</button>
    </div>
  `,
    styles: [`.form { display: flex; flex-direction: column; gap: 12px; width: 360px; }`]
})
export class NewHouseExpenseDialogComponent {
    private dialogRef = inject(MatDialogRef<NewHouseExpenseDialogComponent>);
    private expenseService = inject(ExpenseService);

    description = '';
    amount: number | null = null;

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    valid() { return !!this.amount && this.amount > 0; }

    save() {
        const h = this.data.house;
        const paidById = h.members[0]?.id; // simple default payer
        this.expenseService.createExpense({
            description: this.description,
            amount: this.amount || 0,
            date: new Date(),
            houseId: h.id,
            paidById,
            expenseShares: h.members.map(m => ({ roomieId: m.id, shareAmount: Math.round((this.amount || 0) / Math.max(1, h.members.length)) }))
        }).subscribe(() => this.close(true));
    }

    close(ok: boolean) { this.dialogRef.close(ok); }
}
