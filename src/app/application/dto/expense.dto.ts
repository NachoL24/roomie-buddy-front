/**
 * DTOs específicos para la capa de aplicación
 * Estos son diferentes a los DTOs de la capa de datos
 * porque representan la interfaz entre la UI y la lógica de negocio
 */

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  houseId: number;
  paidByRoomieId: number;
  splitType: ExpenseSplitType;
  customShares?: CustomShare[];
}

export interface CustomShare {
  roomieId: number;
  shareAmount: number;
}

export enum ExpenseSplitType {
  EQUAL = 'EQUAL',
  BY_RATIO = 'BY_RATIO',
  CUSTOM = 'CUSTOM'
}

export interface ExpenseFilter {
  houseId: number;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  paidBy?: number;
}

export interface ExpensesSummaryRequest {
  houseId: number;
  period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' | 'CUSTOM';
  startDate?: Date;
  endDate?: Date;
}
