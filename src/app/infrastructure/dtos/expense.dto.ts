// House Expense DTOs
export interface HouseExpenseCreateRequestDto {
  description?: string;
  amount: number;
  date: Date;
  paidById: number;
  houseId: number;
  expenseShares?: ExpenseShareDto[];
}

export interface HouseExpenseUpdateRequestDto {
  description?: string;
  amount?: number;
  date?: Date;
  paidById?: number;
  expenseShares?: ExpenseShareDto[];
}

export interface ExpenseShareDto {
  roomieId: number;
  shareAmount: number;
}

export interface HouseExpenseResponseDto {
  id: number;
  description?: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt?: string;
  paidById: number;
  houseId: number;
  expenseShares: ExpenseShareResponseDto[];
}

export interface ExpenseShareResponseDto {
  id: number;
  expenseId: number;
  roomieId: number;
  shareAmount: number;
}

export interface HouseExpenseSummaryResponseDto {
  roomieId: number;
  totalPaid: number;
  totalOwed: number;
  balance: number;
  expenseCount: number;
}

// Personal Expense DTOs
export interface PersonalExpenseCreateRequestDto {
  description?: string;
  amount: number;
  date: Date;
}

export interface PersonalExpenseUpdateRequestDto {
  description?: string;
  amount?: number;
  date?: Date;
}

export interface PersonalExpenseResponseDto {
  id: number;
  description?: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt?: string;
  paidById: number;
}

export interface PersonalExpenseSummaryResponseDto {
  currentMonthExpenses: number;
  currentMonthIncome: number;
  currentMonthBalance: number;
  totalBalance: number;
  periodStartDate: Date;
  periodEndDate: Date;
  expenseCount: number;
  incomeCount: number;
}

// Legacy DTOs (for backward compatibility)
export interface CreateExpenseRequestDto extends HouseExpenseCreateRequestDto { }
export interface ExpenseShareRequestDto extends ExpenseShareDto { }
export interface UpdateExpenseRequestDto extends HouseExpenseUpdateRequestDto { }
export interface ExpenseResponseDto extends HouseExpenseResponseDto { }
export interface ExpenseSummaryResponseDto extends PersonalExpenseSummaryResponseDto {
  topCategories: ExpenseCategoryResponseDto[];
}
export interface ExpenseCategoryResponseDto {
  description: string;
  amount: number;
}
