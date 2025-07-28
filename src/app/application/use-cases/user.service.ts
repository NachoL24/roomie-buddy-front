import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private userRepository: UserRepository) { }

    getCurrentUser(): Observable<User> {
        return this.userRepository.getCurrentUser();
    }

    updateUserProfile(id: number, userData: Partial<User>): Observable<User> {
        return this.userRepository.updateUser(id, userData);
    }

    getUserMetadata(): Observable<any> {
        return this.userRepository.getUserMetadata();
    }
}
