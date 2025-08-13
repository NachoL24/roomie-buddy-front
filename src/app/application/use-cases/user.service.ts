import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userRepository: UserRepository) { }

  updateUserProfile(id: number, userData: Partial<User>): Observable<User> {
    return this.userRepository.updateUser(id, userData);
  }

  getUserMetadata(): Observable<any> {
    return this.userRepository.getUserMetadata();
  }

  getOrCreateUserFromBackend(): Observable<User> {
    return this.userRepository.getOrCreateUserFromBackend();
  }

  findUserByEmail(email: string, houseId: number): Observable<User[]> {
    return this.userRepository.findUserByEmail(email, houseId);
  }

  findUserById(inviteeId: number) {
    return this.userRepository.findUserById(inviteeId);
  }
}
