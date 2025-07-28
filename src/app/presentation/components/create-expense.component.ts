import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ExpenseService,
  HouseService
} from '../../application/use-cases';
import {
  CreateExpenseRequest,
  ExpenseSplitType
} from '../../application/dto';
import {
  BusinessValidationError,
  ExternalServiceError
} from '../../application/exceptions/business-validation.error';
import { House } from '../../domain/entities';

/**
 * Ejemplo de componente usando la nueva estructura de Clean Architecture
 * Demuestra validación de reglas de negocio y manejo de errores
 */
@Component({
  selector: 'app-create-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-expense-container">
      <h2>Crear Nuevo Gasto</h2>

      <form (ngSubmit)="onSubmit()" #expenseForm="ngForm">
        <div class="form-group">
          <label for="description">Descripción:</label>
          <input
            type="text"
            id="description"
            name="description"
            [(ngModel)]="expense.description"
            required
            maxlength="255"
            #description="ngModel"
            class="form-control"
            [class.is-invalid]="description.invalid && description.touched">
          <div *ngIf="description.invalid && description.touched" class="invalid-feedback">
            La descripción es requerida (máximo 255 caracteres)
          </div>
        </div>

        <div class="form-group">
          <label for="amount">Monto ($):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            [(ngModel)]="expense.amount"
            required
            min="1"
            max="999999999"
            #amount="ngModel"
            class="form-control"
            [class.is-invalid]="amount.invalid && amount.touched">
          <div *ngIf="amount.invalid && amount.touched" class="invalid-feedback">
            El monto debe ser mayor a 0 y menor a $999,999,999
          </div>
        </div>

        <div class="form-group">
          <label for="house">Casa:</label>
          <select
            id="house"
            name="houseId"
            [(ngModel)]="expense.houseId"
            required
            #house="ngModel"
            class="form-control"
            [class.is-invalid]="house.invalid && house.touched">
            <option value="">Seleccionar casa...</option>
            <option *ngFor="let house of houses" [value]="house.id">
              {{house.name}} ({{house.members.length}} miembros)
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="splitType">Tipo de División:</label>
          <select
            id="splitType"
            name="splitType"
            [(ngModel)]="expense.splitType"
            required
            class="form-control"
            (change)="onSplitTypeChange()">
            <option value="">Seleccionar tipo...</option>
            <option [value]="ExpenseSplitType.EQUAL">División Igual</option>
            <option [value]="ExpenseSplitType.BY_RATIO">Por Ratio de Pago</option>
            <option [value]="ExpenseSplitType.CUSTOM">Personalizada</option>
          </select>
        </div>

        <!-- División personalizada -->
        <div *ngIf="expense.splitType === ExpenseSplitType.CUSTOM" class="custom-shares">
          <h4>División Personalizada</h4>
          <div *ngFor="let member of selectedHouseMembers; let i = index" class="share-item">
            <label>{{member.firstName}} {{member.lastName}}:</label>
            <input
              type="number"
              [(ngModel)]="customShares[i].shareAmount"
              [name]="'share_' + i"
              min="0"
              [max]="expense.amount"
              class="form-control share-input">
          </div>
          <div class="share-total">
            <strong [innerHTML]="'Total: $' + totalShares + ' / $' + expense.amount"></strong>
            <span *ngIf="this.totalShares !== this.expense.amount" class="text-danger">
              ⚠️ La suma debe ser igual al monto total
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="expenseForm.invalid || isLoading || (expense.splitType === ExpenseSplitType.CUSTOM && this.totalShares !== expense.amount)">
            <span *ngIf="isLoading" class="spinner">⏳</span>
            Crear Gasto
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">
            Cancelar
          </button>
        </div>
      </form>

      <!-- Mensajes de error -->
      <div *ngIf="errorMessage" class="alert alert-danger">
        <strong>Error:</strong> {{errorMessage}}
      </div>

      <!-- Mensaje de éxito -->
      <div *ngIf="successMessage" class="alert alert-success">
        <strong>Éxito:</strong> {{successMessage}}
      </div>
    </div>
  `,
  styles: [`
    .create-expense-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }

    .custom-shares {
      border: 1px solid #eee;
      padding: 15px;
      border-radius: 4px;
      margin: 15px 0;
    }

    .share-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .share-input {
      width: 120px;
      margin-left: 10px;
    }

    .share-total {
      text-align: center;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
      margin-top: 15px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 30px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert {
      padding: 12px;
      border-radius: 4px;
      margin-top: 15px;
    }

    .alert-danger {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .text-danger {
      color: #dc3545;
    }

    .spinner {
      margin-right: 5px;
    }
  `]
})
export class CreateExpenseComponent implements OnInit {
  // Servicios inyectados
  private expenseService = inject(ExpenseService);
  private houseService = inject(HouseService);

  // Enum para usar en template
  ExpenseSplitType = ExpenseSplitType;

  // Estado del componente
  houses: House[] = [];
  selectedHouseMembers: any[] = [];
  customShares: { roomieId: number; shareAmount: number }[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Modelo del formulario
  expense: CreateExpenseRequest = {
    description: '',
    amount: 0,
    houseId: 0,
    paidByRoomieId: 1, // TODO: obtener del usuario actual
    splitType: ExpenseSplitType.EQUAL
  };

  ngOnInit() {
    this.loadUserHouses();
  }

  /**
   * Carga las casas del usuario
   */
  private loadUserHouses() {
    // TODO: obtener ID del usuario actual
    const currentUserId = 1;

    this.houseService.getMyHouses(currentUserId).subscribe({
      next: (houses) => {
        this.houses = houses;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las casas';
        console.error('Error loading houses:', error);
      }
    });
  }

  /**
   * Maneja el cambio de tipo de división
   */
  onSplitTypeChange() {
    if (this.expense.splitType === ExpenseSplitType.CUSTOM) {
      this.setupCustomShares();
    }
  }

  /**
   * Configura las divisiones personalizadas
   */
  private setupCustomShares() {
    const selectedHouse = this.houses.find(h => h.id === this.expense.houseId);
    if (selectedHouse) {
      this.selectedHouseMembers = selectedHouse.members;
      this.customShares = selectedHouse.members.map(member => ({
        roomieId: member.id,
        shareAmount: 0
      }));
    }
  }

  /**
   * Getter para el total de divisiones personalizadas
   */
  get totalShares(): number {
    return this.customShares.reduce((sum, share) => sum + (share.shareAmount || 0), 0);
  }

  /**
   * Envía el formulario
   */
  onSubmit() {
    if (this.expense.splitType === ExpenseSplitType.CUSTOM) {
      this.expense.customShares = this.customShares;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Obtener IDs de miembros de la casa seleccionada
    const selectedHouse = this.houses.find(h => h.id === this.expense.houseId);
    const houseMemberIds = selectedHouse?.members.map(m => m.id) || [];

    this.expenseService.createExpenseWithValidation(this.expense, houseMemberIds).subscribe({
      next: (createdExpense) => {
        this.isLoading = false;
        this.successMessage = `Gasto "${createdExpense.description}" creado exitosamente por $${createdExpense.amount}`;
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;

        if (error instanceof BusinessValidationError) {
          this.errorMessage = error.message;
        } else if (error instanceof ExternalServiceError) {
          this.errorMessage = 'Error de conexión. Intente nuevamente.';
        } else {
          this.errorMessage = 'Error inesperado. Contacte al soporte.';
        }

        console.error('Error creating expense:', error);
      }
    });
  }

  /**
   * Cancela la creación del gasto
   */
  onCancel() {
    this.resetForm();
  }

  /**
   * Reinicia el formulario
   */
  private resetForm() {
    this.expense = {
      description: '',
      amount: 0,
      houseId: 0,
      paidByRoomieId: 1,
      splitType: ExpenseSplitType.EQUAL
    };
    this.customShares = [];
    this.selectedHouseMembers = [];
  }
}
