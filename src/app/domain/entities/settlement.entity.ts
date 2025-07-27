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
