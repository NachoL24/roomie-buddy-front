// House Expense Entity
export interface HouseExpense {
  id: number;
  description?: string;
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt?: Date;
  paidById: number;
  houseId: number;
  expenseShares: ExpenseShare[];
}

export interface ExpenseShare {
  id: number;
  expenseId: number;
  roomieId: number;
  roomiePicture?: string;
  shareAmount: number;
}

export interface ExpenseSummary {
  roomieId: number;
  totalPaid: number;
  totalOwed: number;
  balance: number;
  expenseCount: number;
}

// Personal Expense Entity
export interface PersonalExpense {
  id: number;
  description?: string;
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt?: Date;
  paidById: number;
}

export interface PersonalExpenseSummary {
  MonthExpenses: number;
  MonthIncome: number;
  totalBalance: number;
}

// Top items for reports
export interface TopItem {
  description: string;
  amount: number;
}

// Legacy support (will be deprecated)
export interface Expense extends HouseExpense { }

export interface ExpenseCategory extends TopItem { }
