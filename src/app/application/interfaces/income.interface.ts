import { Observable } from 'rxjs';
import { Income, FinancialSummary } from '../../domain/entities';
import {
    CreateIncomeRequest,
    FinancialReportRequest,
    BudgetRequest
} from '../dto/income.dto';

/**
 * Interface que define los casos de uso relacionados con ingresos
 */
export interface IIncomeService {
    createIncome(request: CreateIncomeRequest): Observable<Income>;
    getIncomeById(id: number, userId: number): Observable<Income>;
    getMyIncomes(userId: number, startDate?: Date, endDate?: Date): Observable<Income[]>;
    getHouseIncomes(houseId: number, userId: number, startDate?: Date, endDate?: Date): Observable<Income[]>;
    updateIncome(incomeId: number, request: Partial<CreateIncomeRequest>, userId: number): Observable<Income>;
    deleteIncome(incomeId: number, userId: number): Observable<void>;
    generateFinancialReport(request: FinancialReportRequest): Observable<FinancialSummary>;
    createBudget(request: BudgetRequest): Observable<any>;
    getBudgetStatus(houseId: number, month: number, year: number): Observable<any>;
    getIncomeProjections(houseId: number, months: number): Observable<any>;
    getIncomeCategories(houseId: number): Observable<string[]>;
}

/**
 * Commands para operaciones de ingreso
 */
export interface CreateIncomeCommand {
    userId: number;
    incomeData: CreateIncomeRequest;
}

export interface UpdateIncomeCommand {
    incomeId: number;
    userId: number;
    updateData: Partial<CreateIncomeRequest>;
}

export interface CreateBudgetCommand {
    creatorId: number;
    budgetData: BudgetRequest;
}

/**
 * Queries para consultas de ingreso
 */
export interface GetIncomesQuery {
    houseId?: number;
    userId: number;
    startDate?: Date;
    endDate?: Date;
    includeRecurring?: boolean;
}

export interface GetFinancialReportQuery {
    request: FinancialReportRequest;
    userId: number; // para verificar permisos
}
