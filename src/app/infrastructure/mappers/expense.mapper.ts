import { Expense, ExpenseShare, ExpenseSummary, ExpenseCategory } from '../../domain/entities';
import {
    ExpenseResponse,
    ExpenseShareResponse,
    ExpenseSummaryResponse,
    ExpenseCategoryResponse,
    CreateExpenseRequest,
    UpdateExpenseRequest
} from '../dtos';
import { CreateExpenseData, UpdateExpenseData } from '../../domain/repositories';

export class ExpenseMapper {
    static fromResponse(response: ExpenseResponse): Expense {
        return {
            id: response.id,
            description: response.description,
            amount: response.amount,
            houseId: response.houseId,
            paidByRoomieId: response.paidByRoomieId,
            paidByRoomieName: response.paidByRoomieName,
            createdAt: new Date(response.createdAt),
            expenseShares: response.expenseShares.map(this.shareFromResponse)
        };
    }

    static shareFromResponse(response: ExpenseShareResponse): ExpenseShare {
        return {
            id: response.id,
            roomieId: response.roomieId,
            roomieName: response.roomieName,
            shareAmount: response.shareAmount
        };
    }

    static summaryFromResponse(response: ExpenseSummaryResponse): ExpenseSummary {
        return {
            totalExpenses: response.totalExpenses,
            expenseCount: response.expenseCount,
            averageExpense: response.averageExpense,
            topCategories: response.topCategories.map(this.categoryFromResponse)
        };
    }

    static categoryFromResponse(response: ExpenseCategoryResponse): ExpenseCategory {
        return {
            description: response.description,
            amount: response.amount
        };
    }

    static toCreateRequest(data: CreateExpenseData): CreateExpenseRequest {
        return {
            description: data.description,
            amount: data.amount,
            houseId: data.houseId,
            paidByRoomieId: data.paidByRoomieId,
            expenseShares: data.expenseShares.map(share => ({
                roomieId: share.roomieId,
                shareAmount: share.shareAmount
            }))
        };
    }

    static toUpdateRequest(data: UpdateExpenseData): UpdateExpenseRequest {
        return {
            description: data.description,
            amount: data.amount,
            expenseShares: data.expenseShares?.map(share => ({
                roomieId: share.roomieId,
                shareAmount: share.shareAmount
            }))
        };
    }
}
