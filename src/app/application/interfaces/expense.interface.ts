import { Observable } from 'rxjs';
import { Expense } from '../../domain/entities';
import {
    CreateExpenseRequest,
    ExpenseFilter,
    ExpensesSummaryRequest
} from '../dto/expense.dto';

/**
 * Interface que define los casos de uso relacionados con gastos
 */
export interface IExpenseService {
    createExpense(request: CreateExpenseRequest): Observable<Expense>;
    createExpenseWithValidation(request: CreateExpenseRequest, houseMemberIds: number[]): Observable<Expense>;
    getExpenseById(id: number, userId: number): Observable<Expense>;
    getFilteredExpenses(filter: ExpenseFilter): Observable<Expense[]>;
    getExpensesSummary(request: ExpensesSummaryRequest): Observable<any>;
    updateExpense(expenseId: number, request: Partial<CreateExpenseRequest>, userId: number): Observable<Expense>;
    deleteExpense(expenseId: number, userId: number): Observable<void>;
    duplicateExpense(expenseId: number, newDate?: Date): Observable<Expense>;
    getExpenseCategories(houseId: number): Observable<string[]>;
    bulkImportExpenses(houseId: number, csvData: string): Observable<{ success: number; errors: string[] }>;
}

/**
 * Commands para operaciones de gasto
 */
export interface CreateExpenseCommand {
    creatorId: number;
    expenseData: CreateExpenseRequest;
}

export interface UpdateExpenseCommand {
    expenseId: number;
    userId: number;
    updateData: Partial<CreateExpenseRequest>;
}

export interface DeleteExpenseCommand {
    expenseId: number;
    userId: number;
    reason?: string;
}

/**
 * Queries para consultas de gasto
 */
export interface GetExpensesQuery {
    filter: ExpenseFilter;
    userId: number; // para verificar permisos
}

export interface GetExpenseSummaryQuery {
    request: ExpensesSummaryRequest;
    userId: number;
}
