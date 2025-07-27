export interface Invitation {
    id: number;
    inviteeEmail: string;
    houseId: number;
    houseName?: string;
    inviterName?: string;
    status: InvitationStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum InvitationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    CANCELLED = 'CANCELLED'
}

export interface InvitationSummary {
    totalSent: number;
    totalReceived: number;
    pendingSent: number;
    pendingReceived: number;
    acceptedSent: number;
    acceptedReceived: number;
}
