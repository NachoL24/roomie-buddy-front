// Income DTOs
export interface CreateIncomeRequestDto {
    description: string;
    amount: number;
    houseId: number;
    isRecurring: boolean;
    recurrenceFrequency?: string;
    earnedAt: string;
}

export interface UpdateIncomeRequestDto {
    description?: string;
    amount?: number;
    isRecurring?: boolean;
    recurrenceFrequency?: string;
    earnedAt?: string;
}

export interface IncomeResponseDto {
    id: number;
    description: string;
    amount: number;
    houseId: number;
    roomieId: number;
    roomieName?: string;
    isRecurring: boolean;
    recurrenceFrequency?: string;
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
    topIncomeDescriptions: IncomeCategoryResponseDto[];
    topExpenseDescriptions: TopExpenseCategoryResponseDto[];
}

export interface IncomeCategoryResponseDto {
    description: string;
    amount: number;
}

export interface TopExpenseCategoryResponseDto {
    description: string;
    amount: number;
}
