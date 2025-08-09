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
}

export interface HouseMinimalResponseDto {
  id: number;
  name: string;
}

export interface HouseMemberResponseDto {
  roomieId: number;
  name: string;
  email: string;
  payRatio: number;
  payRatioPercentage: number;
}
