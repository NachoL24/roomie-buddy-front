import { Injectable } from '@angular/core';
import { CreateIncomeRequest, RecurrenceFrequency } from '../dto/income.dto';
import { BusinessValidationError } from '../exceptions/business-validation.error';

/**
 * Validador para reglas de negocio relacionadas con ingresos
 */
@Injectable({
  providedIn: 'root'
})
export class IncomeValidator {

  /**
   * Valida una solicitud de creación de ingreso
   */
  validateCreateIncome(request: CreateIncomeRequest): void {
    this.validateAmount(request.amount);
    this.validateDescription(request.description);
    this.validateRecurrence(request);
    this.validateEarnedDate(request.earnedDate);
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
   * Valida la descripción del ingreso
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
   * Valida la configuración de recurrencia
   */
  private validateRecurrence(request: CreateIncomeRequest): void {
    if (request.isRecurring && !request.frequency) {
      throw new BusinessValidationError('Debe especificar la frecuencia para ingresos recurrentes');
    }

    if (!request.isRecurring && request.frequency) {
      throw new BusinessValidationError('No puede especificar frecuencia para ingresos no recurrentes');
    }
  }

  /**
   * Valida la fecha del ingreso
   */
  private validateEarnedDate(earnedDate: Date): void {
    const now = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(now.getFullYear() + 1);

    if (earnedDate > maxFutureDate) {
      throw new BusinessValidationError('La fecha no puede ser más de un año en el futuro');
    }

    const minPastDate = new Date();
    minPastDate.setFullYear(now.getFullYear() - 10);

    if (earnedDate < minPastDate) {
      throw new BusinessValidationError('La fecha no puede ser más de 10 años en el pasado');
    }
  }
}
