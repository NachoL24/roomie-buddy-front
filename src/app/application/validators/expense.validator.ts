import { Injectable } from '@angular/core';
import { CreateExpenseRequest, ExpenseSplitType } from '@application/dto';
import { BusinessValidationError } from '@application/exceptions/business-validation.error';

/**
 * Validador para reglas de negocio relacionadas con gastos
 */
@Injectable({
  providedIn: 'root'
})
export class ExpenseValidator {

  /**
   * Valida una solicitud de creación de gasto
   */
  validateCreateExpense(request: CreateExpenseRequest): void {
    this.validateAmount(request.amount);
    this.validateDescription(request.description);
    this.validateShares(request);
  }

  /**
   * Valida que el monto sea positivo
   */
  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new BusinessValidationError('El monto debe ser mayor a cero');
    }

    if (amount > 999999999) {
      throw new BusinessValidationError('El monto es demasiado alto');
    }
  }

  /**
   * Valida la descripción del gasto
   */
  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new BusinessValidationError('La descripción es requerida');
    }

    if (description.length > 255) {
      throw new BusinessValidationError('La descripción es demasiado larga (máximo 255 caracteres)');
    }
  }

  /**
   * Valida las divisiones del gasto
   */
  private validateShares(request: CreateExpenseRequest): void {
    if (request.splitType === ExpenseSplitType.CUSTOM) {
      if (!request.customShares || request.customShares.length === 0) {
        throw new BusinessValidationError('Debe especificar las divisiones personalizadas');
      }

      const totalShares = request.customShares.reduce((sum, share) => sum + share.shareAmount, 0);
      const tolerance = 1; // Tolerancia de 1 peso por redondeo

      if (Math.abs(totalShares - request.amount) > tolerance) {
        throw new BusinessValidationError('La suma de las divisiones debe ser igual al monto total');
      }

      // Validar que cada share sea positivo
      request.customShares.forEach(share => {
        if (share.shareAmount <= 0) {
          throw new BusinessValidationError('Cada división debe ser mayor a cero');
        }
      });
    }
  }

  /**
   * Valida que el usuario tenga permisos para crear el gasto
   */
  validateUserPermissions(userId: number, houseId: number, houseMemberIds: number[]): void {
    if (!houseMemberIds.includes(userId)) {
      throw new BusinessValidationError('No tienes permisos para crear gastos en esta casa');
    }
  }
}
