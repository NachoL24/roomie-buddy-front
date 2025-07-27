export interface Expense {
    id: number;
    description: string;
    amount: number;
    houseId: number;
    paidByRoomieId: number;
    paidByRoomieName?: string;
    createdAt: Date;
    expenseShares: ExpenseShare[];
}

export interface ExpenseShare {
    id?: number;
    roomieId: number;
    roomieName?: string;
    shareAmount: number;
}

export interface ExpenseSummary {
    totalExpenses: number;
    expenseCount: number;
    averageExpense: number;
    topCategories: ExpenseCategory[];
}

export interface ExpenseCategory {
    description: string;
    amount: number;
}
