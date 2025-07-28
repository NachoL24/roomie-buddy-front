import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExpenseRepository, CreateExpenseData, UpdateExpenseData } from '../../domain/repositories';
import { Expense, ExpenseSummary } from '../../domain/entities';
import { ExpenseValidator } from '../validators/expense.validator';
import { CreateExpenseRequest, ExpenseSplitType } from '../dto/expense.dto';
import { BusinessValidationError, ExternalServiceError } from '../exceptions/business-validation.error';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(
    private expenseRepository: ExpenseRepository,
    private expenseValidator: ExpenseValidator
  ) { }

  /**
   * Crea un gasto con validación de reglas de negocio
   */
  createExpenseWithValidation(request: CreateExpenseRequest, houseMemberIds: number[]): Observable<Expense> {
    try {
      // Validar reglas de negocio
      this.expenseValidator.validateCreateExpense(request);
      this.expenseValidator.validateUserPermissions(request.paidByRoomieId, request.houseId, houseMemberIds);

      // Convertir a datos del dominio
      const expenseData = this.mapToCreateExpenseData(request);

      return this.expenseRepository.createExpense(expenseData).pipe(
        catchError(error => {
          console.error('Error creating expense:', error);
          return throwError(() => new ExternalServiceError('Expense API', error));
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * Método básico para crear gastos (sin validación adicional)
   */
  createExpense(expenseData: CreateExpenseData): Observable<Expense> {
    return this.expenseRepository.createExpense(expenseData);
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.expenseRepository.getExpenseById(id);
  }

  getHouseExpenses(houseId: number, startDate?: string, endDate?: string): Observable<Expense[]> {
    return this.expenseRepository.getExpensesByHouse(houseId, startDate, endDate);
  }

  getMyExpenses(roomieId: number): Observable<Expense[]> {
    return this.expenseRepository.getExpensesByRoomie(roomieId);
  }

  getHouseExpenseSummary(houseId: number): Observable<ExpenseSummary> {
    return this.expenseRepository.getExpenseSummaryByHouse(houseId);
  }

  updateExpense(id: number, expenseData: UpdateExpenseData): Observable<Expense> {
    return this.expenseRepository.updateExpense(id, expenseData);
  }

  deleteExpense(id: number): Observable<void> {
    return this.expenseRepository.deleteExpense(id);
  }

  /**
   * Creates a shared expense with automatic calculation of shares based on pay ratios
   */
  createSharedExpense(
    description: string,
    amount: number,
    houseId: number,
    paidByRoomieId: number,
    members: { roomieId: number; payRatio: number }[]
  ): Observable<Expense> {
    const expenseShares = members.map(member => ({
      roomieId: member.roomieId,
      shareAmount: Math.round(amount * member.payRatio)
    }));

    const expenseData: CreateExpenseData = {
      description,
      amount,
      houseId,
      paidByRoomieId,
      expenseShares
    };

    return this.createExpense(expenseData);
  }

  /**
   * Creates an equal split expense among all members
   */
  createEqualSplitExpense(
    description: string,
    amount: number,
    houseId: number,
    paidByRoomieId: number,
    memberIds: number[]
  ): Observable<Expense> {
    const shareAmount = Math.round(amount / memberIds.length);
    const expenseShares = memberIds.map(roomieId => ({
      roomieId,
      shareAmount
    }));

    const expenseData: CreateExpenseData = {
      description,
      amount,
      houseId,
      paidByRoomieId,
      expenseShares
    };

    return this.createExpense(expenseData);
  }

  /**
   * Mapea la request de la aplicación a datos del dominio
   */
  private mapToCreateExpenseData(request: CreateExpenseRequest): CreateExpenseData {
    let expenseShares;

    switch (request.splitType) {
      case ExpenseSplitType.CUSTOM:
        expenseShares = request.customShares || [];
        break;
      case ExpenseSplitType.EQUAL:
        // Este caso requeriría la lista de miembros para calcular divisiones iguales
        throw new BusinessValidationError('División igual requiere implementación adicional');
      case ExpenseSplitType.BY_RATIO:
        // Este caso requeriría los ratios de la casa
        throw new BusinessValidationError('División por ratio requiere implementación adicional');
      default:
        throw new BusinessValidationError('Tipo de división no soportado');
    }

    return {
      description: request.description,
      amount: request.amount,
      houseId: request.houseId,
      paidByRoomieId: request.paidByRoomieId,
      expenseShares
    };
  }
}
