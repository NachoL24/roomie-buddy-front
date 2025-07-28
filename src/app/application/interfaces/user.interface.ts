import { Observable } from 'rxjs';
import { User } from '../../domain/entities';
import {
  UpdateUserProfileRequest,
  ChangePasswordRequest,
  UserProfileResult,
  UserPreferencesRequest,
  DeactivateUserRequest
} from '../dto/user.dto';

/**
 * Interface que define los casos de uso relacionados con usuarios
 */
export interface IUserService {
  getCurrentUser(): Observable<User>;
  updateUserProfile(request: UpdateUserProfileRequest): Observable<UserProfileResult>;
  changePassword(request: ChangePasswordRequest): Observable<void>;
  updateUserPreferences(request: UserPreferencesRequest): Observable<void>;
  deactivateUser(request: DeactivateUserRequest): Observable<void>;
  getUserMetadata(): Observable<any>;
  uploadAvatar(file: File): Observable<string>; // returns avatar URL
}

/**
 * Commands para operaciones de usuario
 */
export interface UpdateUserProfileCommand {
  userId: number;
  profileData: UpdateUserProfileRequest;
}

export interface ChangePasswordCommand {
  userId: number;
  passwordData: ChangePasswordRequest;
}

export interface DeactivateUserCommand {
  userId: number;
  deactivationData: DeactivateUserRequest;
}

/**
 * Queries para consultas de usuario
 */
export interface GetUserProfileQuery {
  userId: number;
  includePreferences?: boolean;
  includeStatistics?: boolean;
}
