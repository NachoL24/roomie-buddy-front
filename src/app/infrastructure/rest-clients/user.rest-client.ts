import { Injectable, Inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';
import { UserMapper } from '../mappers';
import { UserResponseDto } from '../dtos';
import { API_BASE_URL } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class UserRestClient extends UserRepository {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiBaseUrl: string
  ) {
    super();
  }

  getOrCreateUserFromBackend(): Observable<User> {
    console.log('Fetching or creating user from backend...');
    return this.http.get<UserResponseDto>(`${this.apiBaseUrl}/user`)
      .pipe(
        map(UserMapper.fromResponse)
      );
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    const request = UserMapper.toUpdateRequest(userData);
    return this.http.put<UserResponseDto>(`${this.apiBaseUrl}/user/${id}`, request)
      .pipe(map(UserMapper.fromResponse));
  }

  getUserMetadata(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/user-metadata`);
  }

  findUserByEmail(email: string, houseId: number): Observable<User[]> {
    return this.http.get<UserResponseDto[]>(`${this.apiBaseUrl}/user/search?email=${email}&houseId=${houseId}`)
      .pipe(
        map(users => users.length > 0 ? users.map(UserMapper.fromResponse) : []),
        shareReplay(1) // Cache the result for subsequent calls
      );
  }

  findUserById(inviteeId: number): Observable<User> {
    return this.http.get<UserResponseDto>(`${this.apiBaseUrl}/user/${inviteeId}`)
      .pipe(
        map(u => UserMapper.fromResponse(u))
      );
  }

}
