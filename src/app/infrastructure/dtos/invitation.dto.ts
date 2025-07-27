// Invitation DTOs
export interface CreateInvitationRequestDto {
  inviteeEmail: string;
  houseId: number;
}

export interface InvitationResponseDto {
  id: number;
  inviteeEmail: string;
  houseId: number;
  houseName?: string;
  inviterName?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationSummaryResponseDto {
  totalSent: number;
  totalReceived: number;
  pendingSent: number;
  pendingReceived: number;
  acceptedSent: number;
  acceptedReceived: number;
}
