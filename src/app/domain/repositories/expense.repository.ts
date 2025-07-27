import { Observable } from 'rxjs';
import { Expense, ExpenseSummary } from '../../domain/entities';

export interface CreateExpenseData {
    description: string;
    amount: number;
    houseId: number;
    paidByRoomieId: number;
    expenseShares: ExpenseShareData[];
}

export interface ExpenseShareData {
    roomieId: number;
    shareAmount: number;
}

export interface UpdateExpenseData {
    description?: string;
    amount?: number;
    expenseShares?: ExpenseShareData[];
}

export abstract class ExpenseRepository {
    abstract createExpense(data: CreateExpenseData): Observable<Expense>;
    abstract getExpenseById(id: number): Observable<Expense>;
    abstract getExpensesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<Expense[]>;
    abstract getExpensesByRoomie(roomieId: number): Observable<Expense[]>;
    abstract getExpenseSummaryByHouse(houseId: number): Observable<ExpenseSummary>;
    abstract updateExpense(id: number, data: UpdateExpenseData): Observable<Expense>;
    abstract deleteExpense(id: number): Observable<void>;
}
