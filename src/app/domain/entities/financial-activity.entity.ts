export interface FinancialActivity {
  id: number;
  type: FinancialActivityType;
  personal: boolean;
  houseName?: string;
  description: string;
  amount: number;
  date: Date;
  paidByName?: string;
  paidByPicture?: string;
  paidToName?: string;
  paidToPicture?: string;
}

export enum FinancialActivityType {
  EXPENSE = 'expense',
  INCOME = 'income',
  SETTLEMENT = 'settlement'
}
