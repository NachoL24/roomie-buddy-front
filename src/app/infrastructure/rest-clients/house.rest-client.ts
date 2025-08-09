import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HouseRepository, PayRatioUpdate } from '../../domain/repositories';
import { House, HouseMinimal } from '../../domain/entities';
import { HouseMapper } from '../mappers';
import { HouseMinimalResponseDto, HouseResponseDto } from '../dtos';
import { API_BASE_URL } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class HouseRestClient extends HouseRepository {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiBaseUrl: string
  ) {
    super();
  }

  getHouseById(id: number): Observable<House> {
    return this.http.get<HouseResponseDto>(`${this.apiBaseUrl}/houses/${id}`)
      .pipe(map(HouseMapper.fromResponse));
  }

  getHousesByRoomie(roomieId: number): Observable<HouseMinimal[]> {
    return this.http.get<HouseMinimalResponseDto[]>(`${this.apiBaseUrl}/houses/roomie/${roomieId}`)
      .pipe(map(houses => houses.map(HouseMapper.fromResponseMinimal)));
  }

  createHouse(name: string): Observable<HouseMinimal> {
    const request = HouseMapper.toCreateRequest(name);
    return this.http.post<HouseResponseDto>(`${this.apiBaseUrl}/houses`, request)
      .pipe(map(house => HouseMapper.fromResponseMinimal(house)));
  }

  updateHouseName(houseId: number, name: string): Observable<House> {
    const request = HouseMapper.toUpdateNameRequest(name);
    return this.http.put<HouseResponseDto>(`${this.apiBaseUrl}/houses/${houseId}/name`, request)
      .pipe(map(HouseMapper.fromResponse));
  }

  updatePayRatios(houseId: number, payRatios: PayRatioUpdate[]): Observable<void> {
    const request = HouseMapper.toUpdatePayRatiosRequest(payRatios);
    return this.http.put<void>(`${this.apiBaseUrl}/houses/${houseId}/pay-ratios`, request);
  }

  leaveHouse(houseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/houses/${houseId}/leave`);
  }

  removeMember(houseId: number, roomieId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/houses/${houseId}/members/${roomieId}`);
  }

  deleteHouse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/houses/${id}`);
  }
}
