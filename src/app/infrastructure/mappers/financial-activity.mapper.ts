import { Page } from '@domain/entities/page.entity';
import { FinancialActivity, FinancialActivityType } from '../../domain/entities/financial-activity.entity';
import { FinancialActivityResponseDto, FinancialActivitiesPageResponseDto } from '../dtos/financial-activity.dto';

export class FinancialActivityMapper {
    static fromResponse(response: FinancialActivityResponseDto): FinancialActivity {
        return {
            id: response.id,
            type: response.type === 'expense' ? FinancialActivityType.EXPENSE : FinancialActivityType.INCOME,
            description: response.description,
            amount: response.amount,
            date: new Date(response.date)
        };
    }

    static pageFromResponse(response: FinancialActivitiesPageResponseDto): Page<FinancialActivity> {
        return {
            items: response.activities.map(this.fromResponse),
            totalCount: response.totalCount,
            page: response.page,
            pageSize: response.pageSize,
            totalPages: response.totalPages,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage
        };
    }
}
