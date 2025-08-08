import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialActivityRepository, GetFinancialActivitiesParams } from '../../domain/repositories/financial-activity.repository';
import { FinancialActivity } from '../../domain/entities/financial-activity.entity';
import { Page } from '@domain/entities/page.entity';

@Injectable({
    providedIn: 'root'
})
export class FinancialActivityService {
    constructor(private financialActivityRepository: FinancialActivityRepository) { }

    getFinancialActivities(params?: GetFinancialActivitiesParams): Observable<Page<FinancialActivity>> {
        return this.financialActivityRepository.getFinancialActivities(params);
    }
}
