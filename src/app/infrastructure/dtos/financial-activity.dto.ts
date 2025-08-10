// Financial Activity DTOs
export interface FinancialActivityResponseDto {
  id: number;
  type: 'expense' | 'settlement' | 'income';
  personal: boolean;
  houseName?: string | null;
  description?: string;
  amount: number;
  date: string;
  paidById?: number;
  paidByName?: string;
  paidByPicture?: string;
  paidToName?: string; // only for settlements
  paidToPicture?: string; // only for settlements
  paidToId?: number;
}

export interface FinancialActivitiesPageResponseDto {
  activities: FinancialActivityResponseDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
