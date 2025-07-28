import { Observable } from 'rxjs';
import { HouseExpense, PersonalExpense, ExpenseSummary, PersonalExpenseSummary } from '../../domain/entities';

// House Expense Data Interfaces
export interface CreateHouseExpenseData {
    description?: string;
    amount: number;
    date: Date;
    paidById: number;
    houseId: number;
    expenseShares?: ExpenseShareData[];
}

export interface ExpenseShareData {
    roomieId: number;
    shareAmount: number;
}

export interface UpdateHouseExpenseData {
    description?: string;
    amount?: number;
    date?: Date;
    paidById?: number;
    expenseShares?: ExpenseShareData[];
}

// Personal Expense Data Interfaces
export interface CreatePersonalExpenseData {
    description?: string;
    amount: number;
    date: Date;
}

export interface UpdatePersonalExpenseData {
    description?: string;
    amount?: number;
    date?: Date;
}

// House Expense Repository
export abstract class HouseExpenseRepository {
    abstract createHouseExpense(data: CreateHouseExpenseData): Observable<HouseExpense>;
    abstract getHouseExpenseById(id: number): Observable<HouseExpense>;
    abstract getHouseExpensesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<HouseExpense[]>;
    abstract getHouseExpensesByRoomie(roomieId: number): Observable<HouseExpense[]>;
    abstract getHouseExpenseSummary(houseId: number): Observable<ExpenseSummary[]>;
    abstract updateHouseExpense(id: number, data: UpdateHouseExpenseData): Observable<HouseExpense>;
    abstract deleteHouseExpense(id: number): Observable<void>;
}

// Personal Expense Repository
export abstract class PersonalExpenseRepository {
    abstract createPersonalExpense(data: CreatePersonalExpenseData): Observable<PersonalExpense>;
    abstract getPersonalExpenses(): Observable<PersonalExpense[]>;
    abstract getPersonalExpenseById(id: number): Observable<PersonalExpense>;
    abstract getPersonalExpenseSummary(): Observable<PersonalExpenseSummary>;
    abstract getPersonalExpensesByDateRange(startDate: string, endDate: string): Observable<PersonalExpense[]>;
    abstract updatePersonalExpense(id: number, data: UpdatePersonalExpenseData): Observable<PersonalExpense>;
    abstract deletePersonalExpense(id: number): Observable<void>;
}

// Legacy support (will be deprecated)
export interface CreateExpenseData extends CreateHouseExpenseData { }
export interface UpdateExpenseData extends UpdateHouseExpenseData { }
export abstract class ExpenseRepository extends HouseExpenseRepository {
    abstract createExpense(data: CreateExpenseData): Observable<HouseExpense>;
    abstract getExpenseById(id: number): Observable<HouseExpense>;
    abstract getExpensesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<HouseExpense[]>;
    abstract getExpensesByRoomie(roomieId: number): Observable<HouseExpense[]>;
    abstract getExpenseSummaryByHouse(houseId: number): Observable<ExpenseSummary[]>;
    abstract updateExpense(id: number, data: UpdateExpenseData): Observable<HouseExpense>;
    abstract deleteExpense(id: number): Observable<void>;
}
