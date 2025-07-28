import { Observable } from 'rxjs';
import { Income, FinancialSummary, RecurrenceFrequency, PeriodType } from '../../domain/entities';

export interface CreateIncomeData {
    description: string;
    amount: number;
    houseId?: number;
    isRecurring?: boolean;
    recurrenceFrequency?: RecurrenceFrequency;
    earnedAt?: Date;
}

export interface UpdateIncomeData {
    description?: string;
    amount?: number;
    isRecurring?: boolean;
    recurrenceFrequency?: RecurrenceFrequency;
    earnedAt?: Date;
}

export interface FinancialSummaryParams {
    houseId: number;
    period?: PeriodType;
    startDate?: string;
    endDate?: string;
}

export abstract class IncomeRepository {
    abstract createIncome(data: CreateIncomeData): Observable<Income>;
    abstract getIncomesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<Income[]>;
    abstract getMyIncomes(): Observable<Income[]>;
    abstract getFinancialSummary(params: FinancialSummaryParams): Observable<FinancialSummary>;
    abstract updateIncome(id: number, data: UpdateIncomeData): Observable<Income>;
    abstract deleteIncome(id: number): Observable<void>;
}
