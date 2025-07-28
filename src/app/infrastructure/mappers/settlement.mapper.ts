import { Settlement, BalanceSummary, RoomieBalance } from '../../domain/entities';
import { SettlementResponseDto, BalanceSummaryResponseDto, RoomieBalanceResponseDto, CreateSettlementRequestDto } from '../dtos';
import { CreateSettlementData } from '../../domain/repositories';

export class SettlementMapper {
    static fromResponse(response: SettlementResponseDto): Settlement {
        return {
            id: response.id,
            fromRoomieId: response.fromRoomieId,
            fromRoomieName: response.fromRoomieName,
            toRoomieId: response.toRoomieId,
            toRoomieName: response.toRoomieName,
            amount: response.amount,
            houseId: response.houseId,
            description: response.description,
            createdAt: new Date(response.createdAt)
        };
    }

    static balanceSummaryFromResponse(response: BalanceSummaryResponseDto): BalanceSummary {
        return {
            houseId: response.houseId,
            balances: response.balances.map(this.roomieBalanceFromResponse)
        };
    }

    static roomieBalanceFromResponse(response: RoomieBalanceResponseDto): RoomieBalance {
        return {
            roomieId: response.roomieId,
            roomieName: response.roomieName,
            totalOwed: response.totalOwed,
            totalOwing: response.totalOwing,
            netBalance: response.netBalance
        };
    }

    static toCreateRequest(data: CreateSettlementData): CreateSettlementRequestDto {
        return {
            fromRoomieId: data.fromRoomieId,
            toRoomieId: data.toRoomieId,
            amount: data.amount,
            houseId: data.houseId,
            description: data.description
        };
    }
}
