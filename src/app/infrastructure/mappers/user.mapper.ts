import { User } from '../../domain/entities';
import { UserResponseDto, CreateUserRequestDto, UpdateUserRequestDto } from '../dtos';

export class UserMapper {
    static fromResponse(response: UserResponseDto): User {
        return {
            id: response.id,
            auth0Sub: response.auth0Sub,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            createdAt: new Date(response.createdAt)
        };
    }

    static toCreateRequest(user: Partial<User>): CreateUserRequestDto {
        return {
            firstName: user.firstName!,
            lastName: user.lastName!
        };
    }

    static toUpdateRequest(user: Partial<User>): UpdateUserRequestDto {
        return {
            firstName: user.firstName,
            lastName: user.lastName
        };
    }
}
