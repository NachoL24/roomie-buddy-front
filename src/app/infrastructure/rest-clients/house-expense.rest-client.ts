import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HouseExpenseRepository, CreateHouseExpenseData, UpdateHouseExpenseData } from '../../domain/repositories';
import { HouseExpense, ExpenseSummary } from '../../domain/entities';
import { HouseExpenseMapper } from '../mappers';
import { HouseExpenseResponseDto, HouseExpenseSummaryResponseDto } from '../dtos';
import { API_BASE_URL } from '../../app.config';

@Injectable({
    providedIn: 'root'
})
export class HouseExpenseRestClient extends HouseExpenseRepository {
    constructor(
        private http: HttpClient,
        @Inject(API_BASE_URL) private apiBaseUrl: string
    ) {
        super();
    }

    createHouseExpense(data: CreateHouseExpenseData): Observable<HouseExpense> {
        const request = HouseExpenseMapper.toCreateRequest(data);
        return this.http.post<HouseExpenseResponseDto>(`${this.apiBaseUrl}/expenses/house`, request)
            .pipe(map(HouseExpenseMapper.fromResponse));
    }

    getHouseExpenseById(id: number): Observable<HouseExpense> {
        return this.http.get<HouseExpenseResponseDto>(`${this.apiBaseUrl}/expenses/house/${id}`)
            .pipe(map(HouseExpenseMapper.fromResponse));
    }

    getHouseExpensesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<HouseExpense[]> {
        let params = new HttpParams();
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);

        return this.http.get<HouseExpenseResponseDto[]>(`${this.apiBaseUrl}/expenses/house/by-house/${houseId}`, { params })
            .pipe(map(expenses => expenses.map(HouseExpenseMapper.fromResponse)));
    }

    getHouseExpensesByRoomie(roomieId: number): Observable<HouseExpense[]> {
        return this.http.get<HouseExpenseResponseDto[]>(`${this.apiBaseUrl}/expenses/house/by-roomie/${roomieId}`)
            .pipe(map(expenses => expenses.map(HouseExpenseMapper.fromResponse)));
    }

    getHouseExpenseSummary(houseId: number): Observable<ExpenseSummary[]> {
        return this.http.get<HouseExpenseSummaryResponseDto[]>(`${this.apiBaseUrl}/expenses/house/summary/${houseId}`)
            .pipe(map(summaries => summaries.map(HouseExpenseMapper.summaryFromResponse)));
    }

    updateHouseExpense(id: number, data: UpdateHouseExpenseData): Observable<HouseExpense> {
        const request = HouseExpenseMapper.toUpdateRequest(data);
        return this.http.put<HouseExpenseResponseDto>(`${this.apiBaseUrl}/expenses/house/${id}`, request)
            .pipe(map(HouseExpenseMapper.fromResponse));
    }

    deleteHouseExpense(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiBaseUrl}/expenses/house/${id}`);
    }
}
