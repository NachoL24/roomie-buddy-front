import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonalExpenseRepository, CreatePersonalExpenseData, UpdatePersonalExpenseData } from '../../domain/repositories';
import { PersonalExpense, PersonalExpenseSummary } from '../../domain/entities';
import { PersonalExpenseMapper } from '../mappers';
import { PersonalExpenseResponseDto, PersonalExpenseSummaryResponseDto } from '../dtos';
import { API_BASE_URL } from '../../app.config';

@Injectable({
    providedIn: 'root'
})
export class PersonalExpenseRestClient extends PersonalExpenseRepository {
    constructor(
        private http: HttpClient,
        @Inject(API_BASE_URL) private apiBaseUrl: string
    ) {
        super();
    }

    createPersonalExpense(data: CreatePersonalExpenseData): Observable<PersonalExpense> {
        const request = PersonalExpenseMapper.toCreateRequest(data);
        return this.http.post<PersonalExpenseResponseDto>(`${this.apiBaseUrl}/expenses/personal`, request)
            .pipe(map(PersonalExpenseMapper.fromResponse));
    }

    getPersonalExpenses(): Observable<PersonalExpense[]> {
        return this.http.get<PersonalExpenseResponseDto[]>(`${this.apiBaseUrl}/expenses/personal`)
            .pipe(map(expenses => expenses.map(PersonalExpenseMapper.fromResponse)));
    }

    getPersonalExpenseById(id: number): Observable<PersonalExpense> {
        return this.http.get<PersonalExpenseResponseDto>(`${this.apiBaseUrl}/expenses/personal/${id}`)
            .pipe(map(PersonalExpenseMapper.fromResponse));
    }

    getPersonalExpenseSummary(): Observable<PersonalExpenseSummary> {
        return this.http.get<PersonalExpenseSummaryResponseDto>(`${this.apiBaseUrl}/expenses/personal/summary`)
            .pipe(map(PersonalExpenseMapper.summaryFromResponse));
    }

    getPersonalExpensesByDateRange(startDate: string, endDate: string): Observable<PersonalExpense[]> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);

        return this.http.get<PersonalExpenseResponseDto[]>(`${this.apiBaseUrl}/expenses/personal/date-range`, { params })
            .pipe(map(expenses => expenses.map(PersonalExpenseMapper.fromResponse)));
    }

    updatePersonalExpense(id: number, data: UpdatePersonalExpenseData): Observable<PersonalExpense> {
        const request = PersonalExpenseMapper.toUpdateRequest(data);
        return this.http.put<PersonalExpenseResponseDto>(`${this.apiBaseUrl}/expenses/personal/${id}`, request)
            .pipe(map(PersonalExpenseMapper.fromResponse));
    }

    deletePersonalExpense(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiBaseUrl}/expenses/personal/${id}`);
    }
}
