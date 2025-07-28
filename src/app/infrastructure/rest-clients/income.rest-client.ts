import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncomeRepository, CreateIncomeData, UpdateIncomeData, FinancialSummaryParams } from '../../domain/repositories';
import { Income, FinancialSummary } from '../../domain/entities';
import { IncomeMapper } from '../mappers';
import { IncomeResponseDto, FinancialSummaryResponseDto } from '../dtos';
import { API_BASE_URL } from '../../app.config';

@Injectable({
    providedIn: 'root'
})
export class IncomeRestClient extends IncomeRepository {
    constructor(
        private http: HttpClient,
        @Inject(API_BASE_URL) private apiBaseUrl: string
    ) {
        super();
    }

    createIncome(data: CreateIncomeData): Observable<Income> {
        const request = IncomeMapper.toCreateRequest(data);
        return this.http.post<IncomeResponseDto>(`${this.apiBaseUrl}/incomes`, request)
            .pipe(map(IncomeMapper.fromResponse));
    }

    getIncomesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<Income[]> {
        if (startDate && endDate) {
            let params = new HttpParams()
                .set('startDate', startDate)
                .set('endDate', endDate);
            return this.http.get<IncomeResponseDto[]>(`${this.apiBaseUrl}/incomes/house/${houseId}/date-range`, { params })
                .pipe(map(incomes => incomes.map(IncomeMapper.fromResponse)));
        } else {
            return this.http.get<IncomeResponseDto[]>(`${this.apiBaseUrl}/incomes/house/${houseId}`)
                .pipe(map(incomes => incomes.map(IncomeMapper.fromResponse)));
        }
    }

    getMyIncomes(): Observable<Income[]> {
        return this.http.get<IncomeResponseDto[]>(`${this.apiBaseUrl}/incomes/my-incomes`)
            .pipe(map(incomes => incomes.map(IncomeMapper.fromResponse)));
    }

    getFinancialSummary(params: FinancialSummaryParams): Observable<FinancialSummary> {
        let httpParams = new HttpParams();

        if (params.period) httpParams = httpParams.set('period', params.period);
        if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
        if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);

        return this.http.get<FinancialSummaryResponseDto>(
            `${this.apiBaseUrl}/incomes/financial-summary/${params.houseId}`,
            { params: httpParams }
        ).pipe(map(IncomeMapper.financialSummaryFromResponse));
    }

    updateIncome(id: number, data: UpdateIncomeData): Observable<Income> {
        const request = IncomeMapper.toUpdateRequest(data);
        return this.http.put<IncomeResponseDto>(`${this.apiBaseUrl}/incomes/${id}`, request)
            .pipe(map(IncomeMapper.fromResponse));
    }

    deleteIncome(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiBaseUrl}/incomes/${id}`);
    }
}
