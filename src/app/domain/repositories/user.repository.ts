import { Observable } from 'rxjs';
import { User } from '../../domain/entities';

export abstract class UserRepository {
  abstract findUserById(inviteeId: number): Observable<User>;
  abstract getOrCreateUserFromBackend(): Observable<User>;
  abstract updateUser(id: number, userData: Partial<User>): Observable<User>;
  abstract getUserMetadata(): Observable<any>;
  abstract findUserByEmail(email: string, houseId: number): Observable<User[]>;
}
