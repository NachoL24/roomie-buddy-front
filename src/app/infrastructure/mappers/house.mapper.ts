import { House, HouseMember, HouseMinimal } from '../../domain/entities';
import { HouseResponseDto, HouseMemberResponseDto, CreateHouseRequestDto, UpdateHouseNameRequestDto, UpdatePayRatiosRequestDto, HouseMinimalResponseDto } from '../dtos';
import { PayRatioUpdate } from '../../domain/repositories';

export class HouseMapper {
  static fromResponse(response: HouseResponseDto): House {
    return {
      id: response.id,
      name: response.name,
      createdAt: new Date(response.createdAt),
      members: response.members.map(this.memberFromResponse),
      totalMembers: response.totalMembers
    };
  }

  static fromResponseMinimal(response: HouseMinimalResponseDto): HouseMinimal {
    return {
      id: response.id,
      name: response.name
    };
  }

  static memberFromResponse(response: HouseMemberResponseDto): HouseMember {
    return {
      id: response.roomieId,
      picture: response.picture,
      firstName: response.name,
      lastName: response.lastName,
      email: response.email,
      payRatio: response.payRatio,
      payRatioPercentage: response.payRatioPercentage
    };
  }

  static toCreateRequest(name: string): CreateHouseRequestDto {
    return { name };
  }

  static toUpdateNameRequest(name: string): UpdateHouseNameRequestDto {
    return { name };
  }

  static toUpdatePayRatiosRequest(payRatios: PayRatioUpdate[]): UpdatePayRatiosRequestDto {
    return { payRatios };
  }
}
