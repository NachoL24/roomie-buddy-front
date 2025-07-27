// Expense DTOs
export interface CreateExpenseRequestDto {
  description: string;
  amount: number;
  houseId: number;
  paidByRoomieId: number;
  expenseShares: ExpenseShareRequestDto[];
}

export interface ExpenseShareRequestDto {
  roomieId: number;
  shareAmount: number;
}

export interface UpdateExpenseRequestDto {
  description?: string;
  amount?: number;
  expenseShares?: ExpenseShareRequestDto[];
}

export interface ExpenseResponseDto {
  id: number;
  description: string;
  amount: number;
  houseId: number;
  paidByRoomieId: number;
  paidByRoomieName?: string;
  createdAt: string;
  expenseShares: ExpenseShareResponseDto[];
}

export interface ExpenseShareResponseDto {
  id: number;
  roomieId: number;
  roomieName?: string;
  shareAmount: number;
}

export interface ExpenseSummaryResponseDto {
  totalExpenses: number;
  expenseCount: number;
  averageExpense: number;
  topCategories: ExpenseCategoryResponseDto[];
}

export interface ExpenseCategoryResponseDto {
  description: string;
  amount: number;
}
