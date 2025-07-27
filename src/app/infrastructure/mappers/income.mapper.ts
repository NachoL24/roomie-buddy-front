import {
    Income,
    FinancialSummary,
    RecurrenceFrequency,
    PeriodType,
    IncomeCategory,
    TopExpenseCategory
} from '../../domain/entities';
import {
    IncomeResponse,
    FinancialSummaryResponse,
    IncomeCategoryResponse,
    TopExpenseCategoryResponse,
    CreateIncomeRequest,
    UpdateIncomeRequest
} from '../dtos';
import { CreateIncomeData, UpdateIncomeData } from '../../domain/repositories';

export class IncomeMapper {
    static fromResponse(response: IncomeResponse): Income {
        return {
            id: response.id,
            description: response.description,
            amount: response.amount,
            houseId: response.houseId,
            roomieId: response.roomieId,
            roomieName: response.roomieName,
            isRecurring: response.isRecurring,
            recurrenceFrequency: response.recurrenceFrequency as RecurrenceFrequency,
            earnedAt: new Date(response.earnedAt),
            createdAt: new Date(response.createdAt)
        };
    }

    static financialSummaryFromResponse(response: FinancialSummaryResponse): FinancialSummary {
        return {
            totalIncome: response.totalIncome,
            totalExpenses: response.totalExpenses,
            netBalance: response.netBalance,
            savingsRate: response.savingsRate,
            periodType: response.periodType as PeriodType,
            startDate: new Date(response.startDate),
            endDate: new Date(response.endDate),
            topIncomeDescriptions: response.topIncomeDescriptions.map(this.incomeCategoryFromResponse),
            topExpenseDescriptions: response.topExpenseDescriptions.map(this.topExpenseCategoryFromResponse)
        };
    }

    static incomeCategoryFromResponse(response: IncomeCategoryResponse): IncomeCategory {
        return {
            description: response.description,
            amount: response.amount
        };
    }

    static topExpenseCategoryFromResponse(response: TopExpenseCategoryResponse): TopExpenseCategory {
        return {
            description: response.description,
            amount: response.amount
        };
    }

    static toCreateRequest(data: CreateIncomeData): CreateIncomeRequest {
        return {
            description: data.description,
            amount: data.amount,
            houseId: data.houseId,
            isRecurring: data.isRecurring,
            recurrenceFrequency: data.recurrenceFrequency,
            earnedAt: data.earnedAt.toISOString()
        };
    }

    static toUpdateRequest(data: UpdateIncomeData): UpdateIncomeRequest {
        return {
            description: data.description,
            amount: data.amount,
            isRecurring: data.isRecurring,
            recurrenceFrequency: data.recurrenceFrequency,
            earnedAt: data.earnedAt?.toISOString()
        };
    }
}
