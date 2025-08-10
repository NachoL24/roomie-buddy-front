export interface FinancialActivity {
  id: number;
  type: FinancialActivityType;
  personal: boolean;
  houseName?: string;
  description: string;
  amount: number;
  date: Date;
  paidById?: number;
  paidByName?: string;
  paidByPicture?: string;
  paidToName?: string;
  paidToPicture?: string;
  paidToId?: number;
}

export enum FinancialActivityType {
  EXPENSE = 'expense',
  INCOME = 'income',
  SETTLEMENT = 'settlement'
}
