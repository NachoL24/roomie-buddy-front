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

export interface UpdateSettlementData {
  amount?: number;
  date?: Date;
  description?: string;
  toRoomieId?: number;
  fromRoomieId?: number;
}

export abstract class SettlementRepository {
  abstract createSettlement(data: CreateSettlementData): Observable<Settlement>;
  abstract updateSettlement(id: number, data: UpdateSettlementData): Observable<Settlement>;
  abstract getSettlementsByHouse(houseId: number): Observable<Settlement[]>;
  abstract getBalanceSummary(houseId: number): Observable<BalanceSummary>;
  abstract getMyHouseBalanceSummary(houseId: number): Observable<HouseBalanceSummary>;
}
