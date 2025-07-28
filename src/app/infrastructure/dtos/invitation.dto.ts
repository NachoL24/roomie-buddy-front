// Invitation DTOs
export interface InvitationCreateRequestDto {
  inviteeEmail: string;
  houseId: number;
}

export interface InvitationResponseDto {
  id: number;
  inviterRoomieId: number;
  inviteeEmail: string;
  houseId: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  createdAt: string;
  respondedAt?: string;
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
