// Settlement DTOs
export interface CreateSettlementRequestDto {
    fromRoomieId: number;
    toRoomieId: number;
    amount: number;
    houseId: number;
    description: string;
}

export interface SettlementResponseDto {
    id: number;
    fromRoomieId: number;
    fromRoomieName?: string;
    toRoomieId: number;
    toRoomieName?: string;
    amount: number;
    houseId: number;
    description: string;
    createdAt: string;
}

export interface BalanceSummaryResponseDto {
    houseId: number;
    balances: RoomieBalanceResponseDto[];
}

export interface RoomieBalanceResponseDto {
    roomieId: number;
    roomieName: string;
    totalOwed: number;
    totalOwing: number;
    netBalance: number;
}
