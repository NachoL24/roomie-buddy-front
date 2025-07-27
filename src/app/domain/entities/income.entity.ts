export interface Income {
    id: number;
    description: string;
    amount: number;
    houseId: number;
    roomieId: number;
    roomieName?: string;
    isRecurring: boolean;
    recurrenceFrequency?: RecurrenceFrequency;
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
    topIncomeDescriptions: IncomeCategory[];
    topExpenseDescriptions: TopExpenseCategory[];
}

export enum PeriodType {
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    YEARLY = 'YEARLY',
    CUSTOM = 'CUSTOM'
}

export interface IncomeCategory {
    description: string;
    amount: number;
}

export interface TopExpenseCategory {
    description: string;
    amount: number;
}
