// User DTOs
export interface CreateUserRequestDto {
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequestDto {
  name: string;
  surname: string;
  document: string;
  picture?: string;
}

export interface UserResponseDto {
  id: number;
  auth0Sub: string;
  name: string;
  surname: string;
  email: string;
  document?: string;
  picture?: string;
  profileCompleted: boolean;
}
