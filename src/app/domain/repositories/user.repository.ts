import { Observable } from 'rxjs';
import { User } from '../../domain/entities';

export abstract class UserRepository {
    abstract getCurrentUser(): Observable<User>;
    abstract updateUser(id: number, userData: Partial<User>): Observable<User>;
    abstract getUserMetadata(): Observable<any>;
}
