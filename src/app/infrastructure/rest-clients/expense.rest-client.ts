import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExpenseRepository, CreateExpenseData, UpdateExpenseData } from '../../domain/repositories';
import { Expense, ExpenseSummary } from '../../domain/entities';
import { ExpenseMapper } from '../mappers';
import { ExpenseResponseDto, ExpenseSummaryResponseDto } from '../dtos';
import { API_BASE_URL } from '../../app.config';

@Injectable({
    providedIn: 'root'
})
export class ExpenseRestClient extends ExpenseRepository {
    constructor(
        private http: HttpClient,
        @Inject(API_BASE_URL) private apiBaseUrl: string
    ) {
        super();
    }

    createExpense(data: CreateExpenseData): Observable<Expense> {
        const request = ExpenseMapper.toCreateRequest(data);
        return this.http.post<ExpenseResponseDto>(`${this.apiBaseUrl}/expenses`, request)
            .pipe(map(ExpenseMapper.fromResponse));
    }

    getExpenseById(id: number): Observable<Expense> {
        return this.http.get<ExpenseResponseDto>(`${this.apiBaseUrl}/expenses/${id}`)
            .pipe(map(ExpenseMapper.fromResponse));
    }

    getExpensesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<Expense[]> {
        let params = new HttpParams();
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);

        return this.http.get<ExpenseResponseDto[]>(`${this.apiBaseUrl}/expenses/house/${houseId}`, { params })
            .pipe(map(expenses => expenses.map(ExpenseMapper.fromResponse)));
    }

    getExpensesByRoomie(roomieId: number): Observable<Expense[]> {
        return this.http.get<ExpenseResponseDto[]>(`${this.apiBaseUrl}/expenses/roomie/${roomieId}`)
            .pipe(map(expenses => expenses.map(ExpenseMapper.fromResponse)));
    }

    getExpenseSummaryByHouse(houseId: number): Observable<ExpenseSummary> {
        return this.http.get<ExpenseSummaryResponseDto>(`${this.apiBaseUrl}/expenses/house/${houseId}/summary`)
            .pipe(map(ExpenseMapper.summaryFromResponse));
    }

    updateExpense(id: number, data: UpdateExpenseData): Observable<Expense> {
        const request = ExpenseMapper.toUpdateRequest(data);
        return this.http.put<ExpenseResponseDto>(`${this.apiBaseUrl}/expenses/${id}`, request)
            .pipe(map(ExpenseMapper.fromResponse));
    }

    deleteExpense(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiBaseUrl}/expenses/${id}`);
    }
}
