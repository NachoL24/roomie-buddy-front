// User DTOs
export interface CreateUserRequestDto {
    firstName: string;
    lastName: string;
}

export interface UpdateUserRequestDto {
    firstName?: string;
    lastName?: string;
}

export interface UserResponseDto {
    id: number;
    auth0Sub: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
}
