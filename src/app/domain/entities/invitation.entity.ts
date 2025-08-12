export interface Invitation {
  id: string;
  houseId: number;
  houseName: string;
  inviterId: number;
  inviteeId: number;
  inviterName: string;
  inviterEmail: string;
  status: InvitationStatus;
  createdAt: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  canceledAt?: Date;
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
