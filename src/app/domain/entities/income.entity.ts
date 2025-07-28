export interface Income {
    id: number;
    description: string;
    amount: number;
    earnedById: number;
    houseId?: number;
    isRecurring: boolean;
    recurrenceFrequency?: RecurrenceFrequency;
    nextRecurrenceDate?: Date;
    earnedAt: Date;
    createdAt: Date;
}

export enum RecurrenceFrequency {
    WEEKLY = 'WEEKLY',
    BIWEEKLY = 'BIWEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    YEARLY = 'YEARLY'
}

export interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    savingsRate: number;
    periodType: PeriodType;
    startDate: Date;
    endDate: Date;
    topIncomeDescriptions: TopIncomeItem[];
    topExpenseDescriptions: TopExpenseItem[];
}

export enum PeriodType {
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    YEARLY = 'YEARLY',
    CUSTOM = 'CUSTOM'
}

export interface TopIncomeItem {
    description: string;
    amount: number;
}

export interface TopExpenseItem {
    description: string;
    amount: number;
}

// Legacy support (will be deprecated)
export interface IncomeCategory extends TopIncomeItem { }
export interface TopExpenseCategory extends TopExpenseItem { }
