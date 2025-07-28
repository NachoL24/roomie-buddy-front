/**
 * DTOs específicos para casos de uso de invitaciones
 */

export interface SendInvitationRequest {
    houseId: number;
    inviteeEmail: string;
    role: HouseMemberRole;
    personalMessage?: string;
    suggestedPayRatio?: number;
}

export interface BulkInvitationRequest {
    houseId: number;
    invitations: {
        email: string;
        role: HouseMemberRole;
        payRatio?: number;
    }[];
    commonMessage?: string;
}

export interface InvitationActionRequest {
    invitationId: number;
    action: InvitationAction;
    message?: string;
}

export enum InvitationAction {
    ACCEPT = 'ACCEPT',
    DECLINE = 'DECLINE',
    CANCEL = 'CANCEL'
}

export interface InvitationFilterRequest {
    status?: InvitationStatus;
    houseId?: number;
    dateFrom?: Date;
    dateTo?: Date;
    type: 'SENT' | 'RECEIVED' | 'ALL';
}

export enum InvitationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED'
}

export interface InvitationSummaryResult {
    totalSent: number;
    totalReceived: number;
    pendingSent: number;
    pendingReceived: number;
    recentActivity: InvitationActivity[];
}

export interface InvitationActivity {
    id: number;
    type: 'SENT' | 'RECEIVED' | 'ACCEPTED' | 'DECLINED';
    houseName: string;
    userEmail: string;
    date: Date;
}

// Importar desde house.dto.ts
import { HouseMemberRole } from './house.dto';
