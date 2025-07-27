import { User } from '../../domain/entities';
import { UserResponse, CreateUserRequest, UpdateUserRequest } from '../dtos';

export class UserMapper {
    static fromResponse(response: UserResponse): User {
        return {
            id: response.id,
            auth0Sub: response.auth0Sub,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            createdAt: new Date(response.createdAt)
        };
    }

    static toCreateRequest(user: Partial<User>): CreateUserRequest {
        return {
            firstName: user.firstName!,
            lastName: user.lastName!
        };
    }

    static toUpdateRequest(user: Partial<User>): UpdateUserRequest {
        return {
            firstName: user.firstName,
            lastName: user.lastName
        };
    }
}
