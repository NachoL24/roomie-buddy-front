import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FinancialActivityRepository, GetFinancialActivitiesParams } from '../../domain/repositories/financial-activity.repository';
import { FinancialActivity } from '../../domain/entities/financial-activity.entity';
import { Page } from '../../domain/entities/page.entity';
import { FinancialActivityMapper } from '../mappers/financial-activity.mapper';
import { FinancialActivitiesPageResponseDto } from '../dtos/financial-activity.dto';
import { API_BASE_URL } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class FinancialActivityRestClient extends FinancialActivityRepository {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiBaseUrl: string
  ) {
    super();
  }

  getFinancialActivities(params?: GetFinancialActivitiesParams): Observable<Page<FinancialActivity>> {
    let httpParams = new HttpParams();

    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }

    return this.http.get<FinancialActivitiesPageResponseDto>(`${this.apiBaseUrl}/financial-activities`, { params: httpParams })
      .pipe(map(a => FinancialActivityMapper.pageFromResponse(a)));
  }

  getHouseFinancialActivities(houseId: number, startDate?: string, endDate?: string, page?: number, pageSize?: number): Observable<Page<FinancialActivity>> {
    let httpParams = new HttpParams();
    if (startDate) httpParams = httpParams.set('startDate', startDate);
    if (endDate) httpParams = httpParams.set('endDate', endDate);
    if (page) httpParams = httpParams.set('page', page.toString());
    if (pageSize) httpParams = httpParams.set('pageSize', pageSize.toString());
    const url = `${this.apiBaseUrl}/expenses/house/by-house/${houseId}`;
    return this.http
      .get<FinancialActivitiesPageResponseDto>(url, { params: httpParams })
      .pipe(map(a => FinancialActivityMapper.pageFromResponse(a)));
  }
}
