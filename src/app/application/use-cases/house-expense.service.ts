import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HouseExpenseRepository, CreateHouseExpenseData, UpdateHouseExpenseData } from '../../domain/repositories';
import { HouseExpense, ExpenseSummary } from '../../domain/entities';

@Injectable({
    providedIn: 'root'
})
export class HouseExpenseService {
    constructor(private houseExpenseRepository: HouseExpenseRepository) { }

    createHouseExpense(expenseData: CreateHouseExpenseData): Observable<HouseExpense> {
        return this.houseExpenseRepository.createHouseExpense(expenseData);
    }

    getHouseExpenseById(id: number): Observable<HouseExpense> {
        return this.houseExpenseRepository.getHouseExpenseById(id);
    }

    getHouseExpensesByHouse(houseId: number, startDate?: string, endDate?: string): Observable<HouseExpense[]> {
        return this.houseExpenseRepository.getHouseExpensesByHouse(houseId, startDate, endDate);
    }

    getHouseExpensesByRoomie(roomieId: number): Observable<HouseExpense[]> {
        return this.houseExpenseRepository.getHouseExpensesByRoomie(roomieId);
    }

    getHouseExpenseSummary(houseId: number): Observable<ExpenseSummary[]> {
        return this.houseExpenseRepository.getHouseExpenseSummary(houseId);
    }

    updateHouseExpense(id: number, expenseData: UpdateHouseExpenseData): Observable<HouseExpense> {
        return this.houseExpenseRepository.updateHouseExpense(id, expenseData);
    }

    deleteHouseExpense(id: number): Observable<void> {
        return this.houseExpenseRepository.deleteHouseExpense(id);
    }

    /**
     * Creates a shared expense with automatic calculation of shares based on pay ratios
     */
    createSharedExpense(
        description: string,
        amount: number,
        houseId: number,
        paidById: number,
        members: { roomieId: number; payRatio: number }[]
    ): Observable<HouseExpense> {
        const expenseShares = members.map(member => ({
            roomieId: member.roomieId,
            shareAmount: Math.round(amount * member.payRatio)
        }));

        const expenseData: CreateHouseExpenseData = {
            description,
            amount,
            date: new Date(),
            houseId,
            paidById,
            expenseShares
        };

        return this.createHouseExpense(expenseData);
    }

    /**
     * Creates an equal split expense among all members
     */
    createEqualSplitExpense(
        description: string,
        amount: number,
        houseId: number,
        paidById: number,
        memberIds: number[]
    ): Observable<HouseExpense> {
        const shareAmount = Math.round(amount / memberIds.length);
        const expenseShares = memberIds.map(roomieId => ({
            roomieId,
            shareAmount
        }));

        const expenseData: CreateHouseExpenseData = {
            description,
            amount,
            date: new Date(),
            houseId,
            paidById,
            expenseShares
        };

        return this.createHouseExpense(expenseData);
    }
}
