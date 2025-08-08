import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { PersonalExpenseService } from "@application/use-cases/personal-expense.service";
import { IncomeService } from "@application/use-cases/income.service";
import { CreatePersonalExpenseData } from "@domain/repositories";
import { CreateIncomeData } from "@domain/repositories";

@Component({
  selector: "app-new-transaction-dialog",
  standalone: true,
  imports: [MatFormField, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <h2>Nueva Transacción</h2>
    <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline">
        <mat-label>Descripción</mat-label>
        <input matInput formControlName="description" required>
        @if (transactionForm.get('description')?.invalid && transactionForm.get('description')?.touched) {
          <mat-error>La descripción es requerida</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Monto</mat-label>
        <input matInput type="number" formControlName="amount" required min="0" step="0.01">
        @if (transactionForm.get('amount')?.invalid && transactionForm.get('amount')?.touched) {
          <mat-error>
            @if (transactionForm.get('amount')?.errors?.['required']) {
              El monto es requerido
            } @else if (transactionForm.get('amount')?.errors?.['min']) {
              El monto debe ser mayor a 0
            }
          </mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Tipo</mat-label>
        <mat-select formControlName="type" required>
          <mat-option value="income">Ingreso</mat-option>
          <mat-option value="expense">Gasto</mat-option>
        </mat-select>
        @if (transactionForm.get('type')?.invalid && transactionForm.get('type')?.touched) {
          <mat-error>El tipo es requerido</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Fecha</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="date" placeholder="DD/MM/YYYY" required>
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        @if (transactionForm.get('date')?.invalid && transactionForm.get('date')?.touched) {
          <mat-error>
            @if (transactionForm.get('date')?.errors?.['required']) {
              La fecha es requerida
            } @else if (transactionForm.get('date')?.errors?.['matDatepickerMax']) {
              No se pueden seleccionar fechas futuras
            }
          </mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Hora (opcional)</mat-label>
        <input matInput type="time" formControlName="time" placeholder="HH:MM">
      </mat-form-field>

      <div class="actions">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="transactionForm.invalid || isSubmitting">
          @if (isSubmitting) {
            Guardando...
          } @else {
            Guardar
          }
        </button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
      max-width: 400px;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 16px;
    }

    form {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 16px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
    }
  `]
})
export class NewTransactionDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<NewTransactionDialogComponent>);
  private snackBar = inject(MatSnackBar);
  private personalExpenseService = inject(PersonalExpenseService);
  private incomeService = inject(IncomeService);

  transactionForm: FormGroup;
  isSubmitting = false;
  maxDate = new Date(); // No permitir fechas futuras

  constructor() {
    this.transactionForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      type: ['', [Validators.required]],
      date: [new Date(), [Validators.required]], // Fecha por defecto: hoy
      time: [''] // Hora opcional
    });

    // Agregar validador de fecha máxima al datepicker
    const dateControl = this.transactionForm.get('date');
    if (dateControl) {
      dateControl.addValidators(this.maxDateValidator.bind(this));
    }
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.isSubmitting = true;
      const formValue = this.transactionForm.value;

      if (formValue.type === 'expense') {
        this.createPersonalExpense(formValue);
      } else if (formValue.type === 'income') {
        this.createIncome(formValue);
      }
    }
  }

  private createPersonalExpense(formValue: any) {
    // Construir la fecha correctamente combinando fecha y hora
    const transactionDate = this.buildTransactionDate(formValue.date, formValue.time);

    const expenseData: CreatePersonalExpenseData = {
      description: formValue.description,
      amount: formValue.amount,
      date: transactionDate
    };

    this.personalExpenseService.createPersonalExpense(expenseData).subscribe({
      next: (expense) => {
        this.snackBar.open('Gasto personal creado exitosamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(expense);
      },
      error: (error) => {
        console.error('Error creating personal expense:', error);
        this.snackBar.open('Error al crear el gasto personal', 'Cerrar', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }

  private createIncome(formValue: any) {
    // Construir la fecha correctamente combinando fecha y hora
    const transactionDate = this.buildTransactionDate(formValue.date, formValue.time);

    const incomeData: CreateIncomeData = {
      description: formValue.description,
      amount: formValue.amount,
      earnedAt: transactionDate,
      isRecurring: false
    };

    this.incomeService.createIncome(incomeData).subscribe({
      next: (income) => {
        this.snackBar.open('Ingreso creado exitosamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(income);
      },
      error: (error) => {
        console.error('Error creating income:', error);
        this.snackBar.open('Error al crear el ingreso', 'Cerrar', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }

  private maxDateValidator(control: any): any {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();

    // Normalizar las fechas a medianoche para comparar solo días
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate > today ? { matDatepickerMax: { max: today, actual: selectedDate } } : null;
  }

  private buildTransactionDate(date: Date, time?: string): Date {
    // Crear una nueva fecha basada en la fecha seleccionada
    const transactionDate = new Date(date);

    if (time) {
      // Si se proporcionó una hora, parsearla y aplicarla
      const [hours, minutes] = time.split(':').map(Number);
      transactionDate.setHours(hours, minutes, 0, 0);
    } else {
      // Si no se proporcionó hora, usar 00:00:00
      transactionDate.setHours(0, 0, 0, 0);
    }

    return transactionDate;
  }

  onCancel() {
    this.dialogRef.close();
  }
}
