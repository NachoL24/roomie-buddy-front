export interface House {
    id: number;
    name: string;
    createdAt: Date;
    members: HouseMember[];
}

export interface HouseMember {
    id: number;
    firstName: string;
    lastName: string;
    payRatio: number;
}
