/**
 * DTOs específicos para casos de uso de casas
 */

export interface CreateHouseRequest {
    name: string;
    description?: string;
    houseType: HouseType;
    initialMembers?: string[]; // emails de invitados iniciales
}

export enum HouseType {
    PERSONAL = 'PERSONAL',
    SHARED = 'SHARED',
    FAMILY = 'FAMILY'
}

export interface UpdateHouseRequest {
    name?: string;
    description?: string;
}

export interface HouseSettingsRequest {
    paymentDayOfMonth: number; // 1-31
    defaultCurrency: 'ARS' | 'USD' | 'EUR';
    expenseCategories: string[];
    allowGuestExpenses: boolean;
    requireApprovalForExpenses: boolean;
    approvalThresholdAmount: number;
}

export interface AddMemberRequest {
    email: string;
    role: HouseMemberRole;
    payRatio?: number;
    invitationMessage?: string;
}

export enum HouseMemberRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
    VIEWER = 'VIEWER'
}

export interface UpdateMemberRoleRequest {
    memberId: number;
    newRole: HouseMemberRole;
    newPayRatio?: number;
}

export interface HouseStatisticsRequest {
    houseId: number;
    period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
    includeProjections?: boolean;
}

export interface LeaveHouseRequest {
    houseId: number;
    transferDataToUserId?: number;
    reason?: string;
}
