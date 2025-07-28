/**
 * DTOs específicos para casos de uso de liquidaciones
 */

export interface CreateSettlementRequest {
    fromUserId: number;
    toUserId: number;
    amount: number;
    houseId: number;
    description: string;
    settlementType: SettlementType;
    relatedExpenseIds?: number[];
}

export enum SettlementType {
    DIRECT_PAYMENT = 'DIRECT_PAYMENT',
    EXPENSE_SETTLEMENT = 'EXPENSE_SETTLEMENT',
    MONTHLY_BALANCE = 'MONTHLY_BALANCE',
    DEBT_FORGIVENESS = 'DEBT_FORGIVENESS'
}

export interface SettlementBatchRequest {
    houseId: number;
    settlements: {
        fromUserId: number;
        toUserId: number;
        amount: number;
        description: string;
    }[];
    batchDescription: string;
}

export interface BalanceCalculationRequest {
    houseId: number;
    includeSettlements: boolean;
    dateFrom?: Date;
    dateTo?: Date;
}

export interface DebtSummaryRequest {
    houseId: number;
    userId?: number; // Si no se especifica, devuelve para todos
    includeProjections?: boolean;
}

export interface DebtSummaryResult {
    userId: number;
    userName: string;
    totalOwed: number;
    totalOwing: number;
    netBalance: number;
    debts: DebtDetail[];
    credits: CreditDetail[];
}

export interface DebtDetail {
    toUserId: number;
    toUserName: string;
    amount: number;
    oldestExpenseDate: Date;
    relatedExpenses: number;
}

export interface CreditDetail {
    fromUserId: number;
    fromUserName: string;
    amount: number;
    oldestExpenseDate: Date;
    relatedExpenses: number;
}

export interface OptimalSettlementRequest {
    houseId: number;
    minimizeTransactions: boolean;
}

export interface OptimalSettlementResult {
    requiredTransactions: OptimalTransaction[];
    totalTransactions: number;
    totalAmountToSettle: number;
}

export interface OptimalTransaction {
    fromUserId: number;
    fromUserName: string;
    toUserId: number;
    toUserName: string;
    amount: number;
    description: string;
}
