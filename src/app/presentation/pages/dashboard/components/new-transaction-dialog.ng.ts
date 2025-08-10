import { Component, Inject, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { dateTimeNotInFutureValidator } from "@presentation/shared/validators/date-time.validators";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { PersonalExpenseService } from "@application/use-cases/personal-expense.service";
import { IncomeService } from "@application/use-cases/income.service";
import { CreatePersonalExpenseData } from "@domain/repositories";
import { CreateIncomeData } from "@domain/repositories";
import { UpdateIncomeData } from "@domain/repositories/income.repository";
import { UpdatePersonalExpenseData } from "@domain/repositories/expense.repository";
import { FinancialActivity, FinancialActivityType } from "@domain/entities/financial-activity.entity";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-new-transaction-dialog",
  standalone: true,
  imports: [MatFormField, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatDialogModule],
  template: `
    <h2>{{ isEditMode ? 'Editar Transacción' : 'Nueva Transacción' }}</h2>
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
        <mat-select formControlName="type" required [disabled]="isEditMode">
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
        @if (transactionForm.get('date')?.invalid) {
          <mat-error>
            @if (transactionForm.get('date')?.errors?.['required']) {
              La fecha es requerida
            } @else if (transactionForm.get('date')?.errors?.['dateTimeFuture']) {
              No se pueden seleccionar fecha y hora futuras
            }
          </mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" >
        <mat-label>Hora (opcional)</mat-label>
        <input matInput type="time" formControlName="time" placeholder="HH:MM">
        <mat-hint>
          <mat-icon>info</mat-icon>
          Si no ingresas una hora, se tomara la hora actual</mat-hint>
      </mat-form-field>

      <div class="actions">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="transactionForm.invalid || isSubmitting">
          @if (isSubmitting) {
            Guardando...
          } @else {
            {{ isEditMode ? 'Guardar cambios' : 'Guardar' }}
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
      max-height: 90vh;
      overflow-y: auto;
      box-sizing: border-box;
      /* Firefox */
      scrollbar-width: thin;
      scrollbar-color: var(--mat-sys-on-primary) transparent;
    }

    /* WebKit-based browsers */
    :host::-webkit-scrollbar {
      width: 8px;
    }

    :host::-webkit-scrollbar-track {
      background: transparent;
    }

    :host::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      border: 2px solid transparent; /* creates padding around the thumb */
      background-clip: content-box;
    }

    :host::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.45);
    }

    .optional-time {
      display: flex;
      flex-direction: row;

      gap: 8px;
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: { activity?: FinancialActivity } | null = null) {
    // Initialize form
    this.transactionForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      type: ['', [Validators.required]],
      date: [null, [Validators.required]], // Fecha por defecto: hoy
      time: [''] // Hora opcional
    });

    // Agregar validador que evita seleccionar fecha y hora futuras
    const dateControl = this.transactionForm.get('date');
    if (dateControl) {
      dateControl.addValidators(dateTimeNotInFutureValidator('time'));
    }

    // Revalidar fecha cuando cambia la hora
    const timeControl = this.transactionForm.get('time');
    timeControl?.valueChanges.subscribe(() => {
      dateControl?.updateValueAndValidity({ onlySelf: true });
    });

    // Detectar modo edición si llega activity por data
    if (this.data?.activity) {
      this.isEditMode = true;
      const activity = this.data.activity;
      this.currentActivityId = activity.id;
      const typeStr = this.toStringType(activity.type);
      this.currentType = typeStr;

      // Prefill form
      const activityDate = new Date(activity.date);
      const timeStr = this.formatTime(activityDate);
      this.transactionForm.patchValue({
        description: activity.description,
        amount: activity.amount,
        type: typeStr ?? '',
        date: activityDate,
        time: timeStr
      });
      // Lock the type control in edit mode
      this.transactionForm.get('type')?.disable();
    }
  }

  transactionForm!: FormGroup;
  isSubmitting = false;
  maxDate = new Date(); // No permitir fechas futuras
  isEditMode = false;
  private currentActivityId: number | null = null;
  private currentType: 'income' | 'expense' | null = null;

  // (constructor contains form initialization and edit-mode setup)

  onSubmit() {
    if (this.transactionForm.valid) {
      this.isSubmitting = true;
      const formValue = this.getRawFormValue();

      if (this.isEditMode && this.currentActivityId && this.currentType) {
        // Update flow
        if (this.currentType === 'expense') {
          this.updatePersonalExpense(this.currentActivityId, formValue);
        } else {
          this.updateIncome(this.currentActivityId, formValue);
        }
      } else {
        // Create flow
        if (formValue.type === 'expense') {
          this.createPersonalExpense(formValue);
        } else if (formValue.type === 'income') {
          this.createIncome(formValue);
        }
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

  private updatePersonalExpense(id: number, formValue: any) {
    const transactionDate = this.buildTransactionDate(formValue.date, formValue.time);

    const expenseData: UpdatePersonalExpenseData = {
      description: formValue.description,
      amount: formValue.amount,
      date: transactionDate
    };

    this.personalExpenseService.updatePersonalExpense(id, expenseData).subscribe({
      next: (expense) => {
        this.snackBar.open('Gasto personal actualizado', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(expense);
      },
      error: (error) => {
        console.error('Error updating personal expense:', error);
        this.snackBar.open('Error al actualizar el gasto personal', 'Cerrar', { duration: 3000 });
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

  private updateIncome(id: number, formValue: any) {
    const transactionDate = this.buildTransactionDate(formValue.date, formValue.time);

    const incomeData: UpdateIncomeData = {
      description: formValue.description,
      amount: formValue.amount,
      earnedAt: transactionDate
    };

    this.incomeService.updateIncome(id, incomeData).subscribe({
      next: (income) => {
        this.snackBar.open('Ingreso actualizado', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(income);
      },
      error: (error) => {
        console.error('Error updating income:', error);
        this.snackBar.open('Error al actualizar el ingreso', 'Cerrar', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }

  // Validator now lives in a shared file for reuse across components

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

  private getRawFormValue() {
    // Include disabled controls (like 'type' in edit mode)
    const raw = this.transactionForm.getRawValue();
    return raw as { description: string; amount: number; type: 'income' | 'expense'; date: Date; time?: string };
  }

  private toStringType(t: FinancialActivityType): 'income' | 'expense' | null {
    switch (t) {
      case FinancialActivityType.EXPENSE:
        return 'expense';
      case FinancialActivityType.INCOME:
        return 'income';
      default:
        return null;
    }
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onCancel() {
    this.dialogRef.close();
  }
}
