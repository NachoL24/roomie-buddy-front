import { Observable } from 'rxjs';
import { House, HouseMember } from '../../domain/entities';

export interface PayRatioUpdate {
    roomieId: number;
    payRatio: number;
}

export abstract class HouseRepository {
    abstract getHouseById(id: number): Observable<House>;
    abstract getHousesByRoomie(roomieId: number): Observable<House[]>;
    abstract createHouse(name: string): Observable<House>;
    abstract updateHouseName(houseId: number, name: string): Observable<House>;
    abstract updatePayRatios(houseId: number, payRatios: PayRatioUpdate[]): Observable<void>;
    abstract leaveHouse(houseId: number): Observable<void>;
    abstract removeMember(houseId: number, roomieId: number): Observable<void>;
    abstract deleteHouse(id: number): Observable<void>;
}
