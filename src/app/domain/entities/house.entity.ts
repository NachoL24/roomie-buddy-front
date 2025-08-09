export interface House {
  id: number;
  name: string;
  createdAt: Date;
  members: HouseMember[];
  totalMembers: number;
}

export interface HouseMember {
  id: number;
  picture?: string;
  firstName: string;
  lastName: string;
  email: string;
  payRatio: number;
  payRatioPercentage: number;
}

export interface HouseMinimal {
  id: number;
  name: string;
}
