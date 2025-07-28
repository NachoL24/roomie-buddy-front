export interface CreateIncomeRequest {
  description: string;
  amount: number;
  houseId: number;
  isRecurring: boolean;
  frequency?: RecurrenceFrequency;
  earnedDate: Date;
  category?: IncomeCategory;
}

export enum RecurrenceFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export enum IncomeCategory {
  SALARY = 'SALARY',
  FREELANCE = 'FREELANCE',
  INVESTMENT = 'INVESTMENT',
  GIFT = 'GIFT',
  OTHER = 'OTHER'
}

export interface FinancialReportRequest {
  houseId: number;
  period: ReportPeriod;
  startDate?: Date;
  endDate?: Date;
  includeProjections?: boolean;
}

export enum ReportPeriod {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}

export interface BudgetRequest {
  houseId: number;
  month: number;
  year: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  name: string;
  budgetAmount: number;
  description?: string;
}
