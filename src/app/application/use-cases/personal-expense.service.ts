import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalExpenseRepository, CreatePersonalExpenseData, UpdatePersonalExpenseData } from '../../domain/repositories';
import { PersonalExpense, PersonalExpenseSummary } from '../../domain/entities';

@Injectable({
    providedIn: 'root'
})
export class PersonalExpenseService {
    constructor(private personalExpenseRepository: PersonalExpenseRepository) { }

    createPersonalExpense(expenseData: CreatePersonalExpenseData): Observable<PersonalExpense> {
        return this.personalExpenseRepository.createPersonalExpense(expenseData);
    }

    getPersonalExpenses(): Observable<PersonalExpense[]> {
        return this.personalExpenseRepository.getPersonalExpenses();
    }

    getPersonalExpenseById(id: number): Observable<PersonalExpense> {
        return this.personalExpenseRepository.getPersonalExpenseById(id);
    }

    getPersonalExpenseSummary(): Observable<PersonalExpenseSummary> {
        return this.personalExpenseRepository.getPersonalExpenseSummary();
    }

    getPersonalExpensesByDateRange(startDate: string, endDate: string): Observable<PersonalExpense[]> {
        return this.personalExpenseRepository.getPersonalExpensesByDateRange(startDate, endDate);
    }

    updatePersonalExpense(id: number, expenseData: UpdatePersonalExpenseData): Observable<PersonalExpense> {
        return this.personalExpenseRepository.updatePersonalExpense(id, expenseData);
    }

    deletePersonalExpense(id: number): Observable<void> {
        return this.personalExpenseRepository.deletePersonalExpense(id);
    }

    /**
     * Creates a quick personal expense with minimal data
     */
    createQuickExpense(
        description: string,
        amount: number,
        date?: Date
    ): Observable<PersonalExpense> {
        const expenseData: CreatePersonalExpenseData = {
            description,
            amount,
            date: date || new Date()
        };

        return this.createPersonalExpense(expenseData);
    }

    /**
     * Gets personal expenses for current month
     */
    getCurrentMonthExpenses(): Observable<PersonalExpense[]> {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        return this.getPersonalExpensesByDateRange(startDate, endDate);
    }
}
