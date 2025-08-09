// House DTOs
export interface CreateHouseRequestDto {
  name: string;
}

export interface UpdateHouseNameRequestDto {
  name: string;
}

export interface UpdatePayRatiosRequestDto {
  payRatios: PayRatioUpdateDto[];
}

export interface PayRatioUpdateDto {
  roomieId: number;
  payRatio: number;
}

export interface HouseResponseDto {
  id: number;
  name: string;
  createdAt: string;
  members: HouseMemberResponseDto[];
  totalMembers: number;
}

export interface HouseMinimalResponseDto {
  id: number;
  name: string;
}

export interface HouseMemberResponseDto {
  roomieId: number;
  name: string;
  lastName: string;
  email: string;
  payRatio: number;
  payRatioPercentage: number;
  picture?: string;
}
