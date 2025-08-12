// Invitation DTOs
export interface InvitationCreateRequestDto {
  inviteeEmail: string;
  houseId: number;
}

export interface InvitationResponseDto {
  id: string;
  houseId: number;
  houseName: string;
  inviterId: number;
  inviteeId: number;
  inviterName: string;
  inviterEmail: string;
  status: 'PENDING' | 'ACCEPTED' | 'CANCELED' | 'DECLINED';
  createdAt: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  canceledAt?: Date;
}

export interface InvitationSummaryResponseDto {
  totalSent: number;
  totalReceived: number;
  pendingSent: number;
  pendingReceived: number;
  acceptedSent: number;
  acceptedReceived: number;
}

// Legacy DTOs (for backward compatibility)
export interface CreateInvitationRequestDto extends InvitationCreateRequestDto { }
