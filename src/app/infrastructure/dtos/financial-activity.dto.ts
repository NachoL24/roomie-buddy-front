// Financial Activity DTOs
export interface FinancialActivityResponseDto {
  id: number;
  type: 'expense' | 'income';
  personal: boolean;
  houseName?: string;
  description: string;
  amount: number;
  date: string;
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
