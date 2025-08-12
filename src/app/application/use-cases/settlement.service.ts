import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettlementRepository, CreateSettlementData } from '../../domain/repositories';
import { Settlement, BalanceSummary, HouseBalanceSummary } from '../../domain/entities';

@Injectable({
    providedIn: 'root'
})
export class SettlementService {
    constructor(private settlementRepository: SettlementRepository) { }

    createSettlement(settlementData: CreateSettlementData): Observable<Settlement> {
        return this.settlementRepository.createSettlement(settlementData);
    }

    getHouseSettlements(houseId: number): Observable<Settlement[]> {
        return this.settlementRepository.getSettlementsByHouse(houseId);
    }

    getHouseBalanceSummary(houseId: number): Observable<BalanceSummary> {
        return this.settlementRepository.getBalanceSummary(houseId);
    }

    getMyHouseBalanceSummary(houseId: number): Observable<HouseBalanceSummary> {
        return this.settlementRepository.getMyHouseBalanceSummary(houseId);
    }

    /**
     * Creates a payment settlement between two roommates
     */
    makePayment(
        fromRoomieId: number,
        toRoomieId: number,
        amount: number,
        houseId: number,
        description: string = 'Payment settlement',
        date: Date
    ): Observable<Settlement> {
        const settlementData: CreateSettlementData = {
            fromRoomieId,
            toRoomieId,
            amount,
            houseId,
            description,
            date: date || new Date()  // Use provided date or current date if not specified
        };
        return this.createSettlement(settlementData);
    }

    /**
     * Creates a settlement for a specific expense
     */
    settleExpense(
        fromRoomieId: number,
        toRoomieId: number,
        amount: number,
        houseId: number,
      expenseDescription: string,
      date: Date
    ): Observable<Settlement> {
        const description = `Settlement for: ${expenseDescription}`;
        return this.makePayment(fromRoomieId, toRoomieId, amount, houseId, description, date);
    }
}
