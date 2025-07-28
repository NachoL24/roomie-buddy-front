import {
    HouseExpense,
    PersonalExpense,
    ExpenseShare,
    ExpenseSummary,
    PersonalExpenseSummary,
    TopItem
} from '../../domain/entities';
import {
    HouseExpenseResponseDto,
    PersonalExpenseResponseDto,
    ExpenseShareResponseDto,
    HouseExpenseSummaryResponseDto,
    PersonalExpenseSummaryResponseDto,
    HouseExpenseCreateRequestDto,
    HouseExpenseUpdateRequestDto,
    PersonalExpenseCreateRequestDto,
    PersonalExpenseUpdateRequestDto
} from '../dtos';
import {
    CreateHouseExpenseData,
    UpdateHouseExpenseData,
    CreatePersonalExpenseData,
    UpdatePersonalExpenseData
} from '../../domain/repositories';

export class HouseExpenseMapper {
    static fromResponse(response: HouseExpenseResponseDto): HouseExpense {
        return {
            id: response.id,
            description: response.description,
            amount: response.amount,
            date: new Date(response.date),
            createdAt: new Date(response.createdAt),
            updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
            paidById: response.paidById,
            houseId: response.houseId,
            expenseShares: response.expenseShares.map(this.shareFromResponse)
        };
    }

    static shareFromResponse(response: ExpenseShareResponseDto): ExpenseShare {
        return {
            id: response.id,
            expenseId: response.expenseId,
            roomieId: response.roomieId,
            shareAmount: response.shareAmount
        };
    }

    static summaryFromResponse(response: HouseExpenseSummaryResponseDto): ExpenseSummary {
        return {
            roomieId: response.roomieId,
            totalPaid: response.totalPaid,
            totalOwed: response.totalOwed,
            balance: response.balance,
            expenseCount: response.expenseCount
        };
    }

    static toCreateRequest(data: CreateHouseExpenseData): HouseExpenseCreateRequestDto {
        return {
            description: data.description,
            amount: data.amount,
            date: data.date,
            paidById: data.paidById,
            houseId: data.houseId,
            expenseShares: data.expenseShares?.map(share => ({
                roomieId: share.roomieId,
                shareAmount: share.shareAmount
            }))
        };
    }

    static toUpdateRequest(data: UpdateHouseExpenseData): HouseExpenseUpdateRequestDto {
        return {
            description: data.description,
            amount: data.amount,
            date: data.date,
            paidById: data.paidById,
            expenseShares: data.expenseShares?.map(share => ({
                roomieId: share.roomieId,
                shareAmount: share.shareAmount
            }))
        };
    }
}

export class PersonalExpenseMapper {
    static fromResponse(response: PersonalExpenseResponseDto): PersonalExpense {
        return {
            id: response.id,
            description: response.description,
            amount: response.amount,
            date: new Date(response.date),
            createdAt: new Date(response.createdAt),
            updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
            paidById: response.paidById
        };
    }

    static summaryFromResponse(response: PersonalExpenseSummaryResponseDto): PersonalExpenseSummary {
        return {
            totalExpenses: response.totalExpenses,
            expenseCount: response.expenseCount,
            averageExpense: response.averageExpense
        };
    }

    static toCreateRequest(data: CreatePersonalExpenseData): PersonalExpenseCreateRequestDto {
        return {
            description: data.description,
            amount: data.amount,
            date: data.date
        };
    }

    static toUpdateRequest(data: UpdatePersonalExpenseData): PersonalExpenseUpdateRequestDto {
        return {
            description: data.description,
            amount: data.amount,
            date: data.date
        };
    }
}

// Legacy mapper (for backward compatibility)
export class ExpenseMapper extends HouseExpenseMapper { }
