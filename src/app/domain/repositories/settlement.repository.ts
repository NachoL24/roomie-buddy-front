import { Observable } from 'rxjs';
import { Settlement, BalanceSummary, HouseBalanceSummary } from '../../domain/entities';

export interface CreateSettlementData {
    fromRoomieId: number;
    toRoomieId: number;
    amount: number;
    houseId: number;
    description: string;
    date: Date;
}

export abstract class SettlementRepository {
    abstract createSettlement(data: CreateSettlementData): Observable<Settlement>;
    abstract getSettlementsByHouse(houseId: number): Observable<Settlement[]>;
    abstract getBalanceSummary(houseId: number): Observable<BalanceSummary>;
    abstract getMyHouseBalanceSummary(houseId: number): Observable<HouseBalanceSummary>;
}
