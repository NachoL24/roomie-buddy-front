import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HouseRepository, PayRatioUpdate } from '../../domain/repositories';
import { House } from '../../domain/entities';

@Injectable({
    providedIn: 'root'
})
export class HouseService {
    constructor(private houseRepository: HouseRepository) { }

    getHouseById(id: number): Observable<House> {
        return this.houseRepository.getHouseById(id);
    }

    getMyHouses(roomieId: number): Observable<House[]> {
        return this.houseRepository.getHousesByRoomie(roomieId);
    }

    createHouse(name: string): Observable<House> {
        return this.houseRepository.createHouse(name);
    }

    updateHouseName(houseId: number, name: string): Observable<House> {
        return this.houseRepository.updateHouseName(houseId, name);
    }

    updatePayRatios(houseId: number, payRatios: PayRatioUpdate[]): Observable<void> {
        return this.houseRepository.updatePayRatios(houseId, payRatios);
    }

    leaveHouse(houseId: number): Observable<void> {
        return this.houseRepository.leaveHouse(houseId);
    }

    removeMemberFromHouse(houseId: number, roomieId: number): Observable<void> {
        return this.houseRepository.removeMember(houseId, roomieId);
    }

    deleteHouse(id: number): Observable<void> {
        return this.houseRepository.deleteHouse(id);
    }
}
