import {
    Income,
    FinancialSummary,
    RecurrenceFrequency,
    PeriodType,
    TopIncomeItem,
    TopExpenseItem
} from '../../domain/entities';
import {
    IncomeResponseDto,
    FinancialSummaryResponseDto,
    TopItemDto,
    IncomeCreateRequestDto,
    IncomeUpdateRequestDto
} from '../dtos';
import { CreateIncomeData, UpdateIncomeData } from '../../domain/repositories';

export class IncomeMapper {
    static fromResponse(response: IncomeResponseDto): Income {
        return {
            id: response.id,
            description: response.description,
            amount: response.amount,
            earnedById: response.earnedById,
            houseId: response.houseId,
            isRecurring: response.isRecurring,
            recurrenceFrequency: response.recurrenceFrequency as RecurrenceFrequency,
            nextRecurrenceDate: response.nextRecurrenceDate ? new Date(response.nextRecurrenceDate) : undefined,
            earnedAt: new Date(response.earnedAt),
            createdAt: new Date(response.createdAt)
        };
    }

    static financialSummaryFromResponse(response: FinancialSummaryResponseDto): FinancialSummary {
        return {
            totalIncome: response.totalIncome,
            totalExpenses: response.totalExpenses,
            netBalance: response.netBalance,
            savingsRate: response.savingsRate,
            periodType: response.periodType as PeriodType,
            startDate: new Date(response.startDate),
            endDate: new Date(response.endDate),
            topIncomeDescriptions: response.topIncomeDescriptions.map(this.topIncomeItemFromResponse),
            topExpenseDescriptions: response.topExpenseDescriptions.map(this.topExpenseItemFromResponse)
        };
    }

    static topIncomeItemFromResponse(response: TopItemDto): TopIncomeItem {
        return {
            description: response.description,
            amount: response.amount
        };
    }

    static topExpenseItemFromResponse(response: TopItemDto): TopExpenseItem {
        return {
            description: response.description,
            amount: response.amount
        };
    }

    static toCreateRequest(data: CreateIncomeData): IncomeCreateRequestDto {
        return {
            description: data.description,
            amount: data.amount,
            houseId: data.houseId,
            isRecurring: data.isRecurring,
            recurrenceFrequency: data.recurrenceFrequency,
            earnedAt: data.earnedAt?.toISOString()
        };
    }

    static toUpdateRequest(data: UpdateIncomeData): IncomeUpdateRequestDto {
        return {
            description: data.description,
            amount: data.amount,
            isRecurring: data.isRecurring,
            recurrenceFrequency: data.recurrenceFrequency,
            earnedAt: data.earnedAt?.toISOString()
        };
    }

    // Legacy support (will be deprecated)
    static incomeCategoryFromResponse = this.topIncomeItemFromResponse;
    static topExpenseCategoryFromResponse = this.topExpenseItemFromResponse;
}
