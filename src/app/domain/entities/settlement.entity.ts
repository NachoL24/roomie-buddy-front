export interface Settlement {
  id: number;
  fromRoomieId: number;
  fromRoomieName?: string;
  toRoomieId: number;
  toRoomieName?: string;
  amount: number;
  houseId: number;
  description: string;
  createdAt: Date;
}

export interface BalanceSummary {
  houseId: number;
  balances: RoomieBalance[];
}

export interface RoomieBalance {
  roomieId: number;
  roomieName: string;
  totalOwed: number;
  totalOwing: number;
  netBalance: number;
}

// New types for per-user balance summary endpoint
export interface BalanceDto { roomieId: number; owesToMe: number; iOwe: number; netBalance: number; }
export interface DetailedBalanceDto { withRoomieId: number; amount: number; description: string; }
export interface HouseBalanceSummary {
  houseId: number;
  myBalance: BalanceDto;
  detailedBalances: DetailedBalanceDto[];
}
