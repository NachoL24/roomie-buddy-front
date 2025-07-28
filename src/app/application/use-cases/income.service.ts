import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IncomeRepository, CreateIncomeData, UpdateIncomeData, FinancialSummaryParams } from '../../domain/repositories';
import { Income, FinancialSummary, RecurrenceFrequency, PeriodType } from '../../domain/entities';

@Injectable({
    providedIn: 'root'
})
export class IncomeService {
    constructor(private incomeRepository: IncomeRepository) { }

    createIncome(incomeData: CreateIncomeData): Observable<Income> {
        return this.incomeRepository.createIncome(incomeData);
    }

    getHouseIncomes(houseId: number, startDate?: string, endDate?: string): Observable<Income[]> {
        return this.incomeRepository.getIncomesByHouse(houseId, startDate, endDate);
    }

    getMyIncomes(): Observable<Income[]> {
        return this.incomeRepository.getMyIncomes();
    }

    getFinancialSummary(houseId: number, period: PeriodType, startDate?: string, endDate?: string): Observable<FinancialSummary> {
        const params: FinancialSummaryParams = {
            houseId,
            period,
            startDate,
            endDate
        };
        return this.incomeRepository.getFinancialSummary(params);
    }

    updateIncome(id: number, incomeData: UpdateIncomeData): Observable<Income> {
        return this.incomeRepository.updateIncome(id, incomeData);
    }

    deleteIncome(id: number): Observable<void> {
        return this.incomeRepository.deleteIncome(id);
    }

    /**
     * Creates a one-time income
     */
    createOneTimeIncome(
        description: string,
        amount: number,
        houseId: number,
        earnedAt: Date = new Date()
    ): Observable<Income> {
        const incomeData: CreateIncomeData = {
            description,
            amount,
            houseId,
            isRecurring: false,
            earnedAt
        };
        return this.createIncome(incomeData);
    }

    /**
     * Creates a recurring income
     */
    createRecurringIncome(
        description: string,
        amount: number,
        houseId: number,
        frequency: RecurrenceFrequency,
        earnedAt: Date = new Date()
    ): Observable<Income> {
        const incomeData: CreateIncomeData = {
            description,
            amount,
            houseId,
            isRecurring: true,
            recurrenceFrequency: frequency,
            earnedAt
        };
        return this.createIncome(incomeData);
    }

    /**
     * Gets monthly financial summary
     */
    getMonthlyFinancialSummary(houseId: number): Observable<FinancialSummary> {
        return this.getFinancialSummary(houseId, PeriodType.MONTHLY);
    }

    /**
     * Gets quarterly financial summary
     */
    getQuarterlyFinancialSummary(houseId: number): Observable<FinancialSummary> {
        return this.getFinancialSummary(houseId, PeriodType.QUARTERLY);
    }

    /**
     * Gets yearly financial summary
     */
    getYearlyFinancialSummary(houseId: number): Observable<FinancialSummary> {
        return this.getFinancialSummary(houseId, PeriodType.YEARLY);
    }

    /**
     * Gets custom period financial summary
     */
    getCustomPeriodFinancialSummary(houseId: number, startDate: string, endDate: string): Observable<FinancialSummary> {
        return this.getFinancialSummary(houseId, PeriodType.CUSTOM, startDate, endDate);
    }
}
