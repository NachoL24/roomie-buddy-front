export interface FinancialActivity {
  id: number;
  type: FinancialActivityType;
  personal: boolean;
  houseName?: string;
  description: string;
  amount: number;
  date: Date;
}

export enum FinancialActivityType {
  EXPENSE = 'expense',
  INCOME = 'income'
}
