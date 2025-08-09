import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExpenseRepository, CreateExpenseData, UpdateExpenseData } from '../../domain/repositories';
import { HouseExpense, ExpenseSummary } from '../../domain/entities';
import { HouseExpenseMapper } from '../mappers';
import { HouseExpenseResponseDto, HouseExpenseSummaryResponseDto } from '../dtos';
import { API_BASE_URL } from '../../app.config';

/**
 * Legacy ExpenseRestClient - delegates to house expenses for backward compatibility
 * @deprecated Use HouseExpenseRestClient or PersonalExpenseRestClient instead
 */
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

    createExpense(data: CreateExpenseData): Observable<HouseExpense> {
        const request = HouseExpenseMapper.toCreateRequest(data);
        return this.http.post<HouseExpenseResponseDto>(`${this.apiBaseUrl}/expenses/house`, request)
            .pipe(map(HouseExpenseMapper.fromResponse));
    }

    getExpenseById(id: number): Observable<HouseExpense> {
        return this.http.get<HouseExpenseResponseDto>(`${this.apiBaseUrl}/expenses/house/${id}`)
            .pipe(map(HouseExpenseMapper.fromResponse));
    }

    getExpensesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<HouseExpense[]> {
        let params = new HttpParams();
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);

        return this.http.get<HouseExpenseResponseDto[]>(`${this.apiBaseUrl}/expenses/house/by-house/${houseId}`, { params })
            .pipe(map(expenses => {console.log("Fetched expenses by house:", expenses); return expenses.map(ex => HouseExpenseMapper.fromResponse(ex))}));
    }

    getExpensesByRoomie(roomieId: number): Observable<HouseExpense[]> {
        return this.http.get<HouseExpenseResponseDto[]>(`${this.apiBaseUrl}/expenses/house/by-roomie/${roomieId}`)
            .pipe(map(expenses => expenses.map(HouseExpenseMapper.fromResponse)));
    }

    getExpenseSummaryByHouse(houseId: number): Observable<ExpenseSummary[]> {
        return this.http.get<HouseExpenseSummaryResponseDto[]>(`${this.apiBaseUrl}/expenses/house/summary/${houseId}`)
            .pipe(map(summaries => summaries.map(HouseExpenseMapper.summaryFromResponse)));
    }

    updateExpense(id: number, data: UpdateExpenseData): Observable<HouseExpense> {
        const request = HouseExpenseMapper.toUpdateRequest(data);
        return this.http.put<HouseExpenseResponseDto>(`${this.apiBaseUrl}/expenses/house/${id}`, request)
            .pipe(map(HouseExpenseMapper.fromResponse));
    }

    deleteExpense(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiBaseUrl}/expenses/house/${id}`);
    }

    // New interface implementations (delegate to house expense methods)
    createHouseExpense(data: CreateExpenseData): Observable<HouseExpense> {
        return this.createExpense(data);
    }

    getHouseExpenseById(id: number): Observable<HouseExpense> {
        return this.getExpenseById(id);
    }

    getHouseExpensesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<HouseExpense[]> {
        return this.getExpensesByHouse(houseId, startDate, endDate);
    }

    getHouseExpensesByRoomie(roomieId: number): Observable<HouseExpense[]> {
        return this.getExpensesByRoomie(roomieId);
    }

    getHouseExpenseSummary(houseId: number): Observable<ExpenseSummary[]> {
        return this.getExpenseSummaryByHouse(houseId);
    }

    updateHouseExpense(id: number, data: UpdateExpenseData): Observable<HouseExpense> {
        return this.updateExpense(id, data);
    }

    deleteHouseExpense(id: number): Observable<void> {
        return this.deleteExpense(id);
    }
}
