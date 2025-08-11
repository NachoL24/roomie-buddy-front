import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettlementRepository, CreateSettlementData } from '../../domain/repositories';
import { Settlement, BalanceSummary, HouseBalanceSummary } from '../../domain/entities';
import { SettlementMapper } from '../mappers';
import { SettlementResponseDto, BalanceSummaryResponseDto, HouseBalanceSummaryResponseDto } from '../dtos';
import { API_BASE_URL } from '../../app.config';

@Injectable({
    providedIn: 'root'
})
export class SettlementRestClient extends SettlementRepository {
    constructor(
        private http: HttpClient,
        @Inject(API_BASE_URL) private apiBaseUrl: string
    ) {
        super();
    }

    createSettlement(data: CreateSettlementData): Observable<Settlement> {
        const request = SettlementMapper.toCreateRequest(data);
        return this.http.post<SettlementResponseDto>(`${this.apiBaseUrl}/settlements`, request)
            .pipe(map(SettlementMapper.fromResponse));
    }

    getSettlementsByHouse(houseId: number): Observable<Settlement[]> {
        return this.http.get<SettlementResponseDto[]>(`${this.apiBaseUrl}/settlements/house/${houseId}`)
            .pipe(map(settlements => settlements.map(SettlementMapper.fromResponse)));
    }

    getBalanceSummary(houseId: number): Observable<BalanceSummary> {
        return this.http.get<BalanceSummaryResponseDto>(`${this.apiBaseUrl}/settlements/balance/${houseId}`)
            .pipe(map(SettlementMapper.balanceSummaryFromResponse));
    }

    getMyHouseBalanceSummary(houseId: number): Observable<HouseBalanceSummary> {
        return this.http.get<HouseBalanceSummaryResponseDto>(`${this.apiBaseUrl}/settlements/balance/${houseId}`)
            .pipe(map(s => SettlementMapper.houseBalanceSummaryFromResponse(s)));
    }
}
