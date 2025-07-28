/**
 * DTOs específicos para casos de uso de usuarios
 */

export interface UpdateUserProfileRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    avatar?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UserProfileResult {
    success: boolean;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        fullName: string;
        avatarUrl?: string;
    };
    message?: string;
}

export interface UserPreferencesRequest {
    language: 'es' | 'en';
    currency: 'ARS' | 'USD' | 'EUR';
    notifications: {
        email: boolean;
        push: boolean;
        expenseReminders: boolean;
        invitations: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
}

export interface DeactivateUserRequest {
    reason: string;
    transferDataToUserId?: number;
}
