// Financial Activity DTOs
export interface FinancialActivityResponseDto {
  id: number;
  type: 'expense' | 'settlement' | 'income';
  personal: boolean;
  houseName?: string | null;
  description?: string;
  amount: number;
  date: string;
  paidByName?: string;
  paidByPicture?: string;
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
