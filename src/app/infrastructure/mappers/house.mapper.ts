import { House, HouseMember } from '../../domain/entities';
import { HouseResponse, HouseMemberResponse, CreateHouseRequest, UpdateHouseNameRequest, UpdatePayRatiosRequest } from '../dtos';
import { PayRatioUpdate } from '../../domain/repositories';

export class HouseMapper {
    static fromResponse(response: HouseResponse): House {
        return {
            id: response.id,
            name: response.name,
            createdAt: new Date(response.createdAt),
            members: response.members.map(this.memberFromResponse)
        };
    }

    static memberFromResponse(response: HouseMemberResponse): HouseMember {
        return {
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            payRatio: response.payRatio
        };
    }

    static toCreateRequest(name: string): CreateHouseRequest {
        return { name };
    }

    static toUpdateNameRequest(name: string): UpdateHouseNameRequest {
        return { name };
    }

    static toUpdatePayRatiosRequest(payRatios: PayRatioUpdate[]): UpdatePayRatiosRequest {
        return { payRatios };
    }
}
