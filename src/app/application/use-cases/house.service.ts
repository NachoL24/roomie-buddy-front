import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HouseRepository, PayRatioUpdate } from '../../domain/repositories';
import { House, HouseMinimal } from '../../domain/entities';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private _refresh$ = new Subject<void>();

  // Notificar a interesados que deben refrescar sus listas de casas
  refresh$ = this._refresh$.asObservable();

  constructor(private houseRepository: HouseRepository) { }

  getHouseById(id: number): Observable<House> {
    return this.houseRepository.getHouseById(id);
  }

  getHousesByRoomieId(roomieId: number): Observable<HouseMinimal[]> {
    return this.houseRepository.getHousesByRoomie(roomieId);
  }

  createHouse(name: string): Observable<HouseMinimal> {
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

  // Disparar un refresh manual tras cambios (p.ej., aceptar invitación)
  triggerRefresh() {
    this._refresh$.next();
  }
}
