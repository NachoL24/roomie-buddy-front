// Income DTOs
export interface IncomeCreateRequestDto {
    description: string;
    amount: number;
    houseId?: number;
    isRecurring?: boolean;
    recurrenceFrequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    earnedAt?: string;
}

export interface IncomeUpdateRequestDto {
    description?: string;
    amount?: number;
    isRecurring?: boolean;
    recurrenceFrequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    earnedAt?: string;
}

export interface IncomeResponseDto {
    id: number;
    description: string;
    amount: number;
    earnedById: number;
    houseId?: number;
    isRecurring: boolean;
    recurrenceFrequency?: string;
    nextRecurrenceDate?: string;
    earnedAt: string;
    createdAt: string;
}

export interface FinancialSummaryResponseDto {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    savingsRate: number;
    periodType: string;
    startDate: string;
    endDate: string;
    topIncomeDescriptions: TopItemDto[];
    topExpenseDescriptions: TopItemDto[];
}

export interface TopItemDto {
    description: string;
    amount: number;
}

// Legacy DTOs (for backward compatibility)
export interface CreateIncomeRequestDto extends IncomeCreateRequestDto { }
export interface IncomeCategoryResponseDto extends TopItemDto { }
export interface TopExpenseCategoryResponseDto extends TopItemDto { }
