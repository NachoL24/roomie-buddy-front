import { Observable } from 'rxjs';
import { FinancialActivity } from '../entities/financial-activity.entity';
import { Page } from '@domain/entities/page.entity';

export interface GetFinancialActivitiesParams {
  page?: number;
  pageSize?: number;
}

export abstract class FinancialActivityRepository {
  abstract getFinancialActivities(params?: GetFinancialActivitiesParams): Observable<Page<FinancialActivity>>;
  abstract getHouseFinancialActivities(
    houseId: number,
    startDate?: string,
    endDate?: string,
    page?: number,
    pageSize?: number
  ): Observable<Page<FinancialActivity>>;
}
