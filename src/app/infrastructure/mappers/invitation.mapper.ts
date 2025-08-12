import { Invitation, InvitationStatus, InvitationSummary } from '../../domain/entities';
import { InvitationResponseDto, InvitationSummaryResponseDto, InvitationCreateRequestDto } from '../dtos';
import { CreateInvitationData } from '../../domain/repositories';

export class InvitationMapper {
  static fromResponse(response: InvitationResponseDto): Invitation {
    return {
      id: response.id,
      houseId: response.houseId,
      houseName: response.houseName,
      inviterId: response.inviterId,
      inviteeId: response.inviteeId,
      inviterName: response.inviterName,
      inviterEmail: response.inviterEmail,
      status: response.status as InvitationStatus,
      createdAt: new Date(response.createdAt),
      acceptedAt: response.acceptedAt ? new Date(response.acceptedAt) : undefined,
      declinedAt: response.declinedAt ? new Date(response.declinedAt) : undefined,
      canceledAt: response.canceledAt ? new Date(response.canceledAt) : undefined
    };
  }

  static summaryFromResponse(response: InvitationSummaryResponseDto): InvitationSummary {
    return {
      totalSent: response.totalSent,
      totalReceived: response.totalReceived,
      pendingSent: response.pendingSent,
      pendingReceived: response.pendingReceived,
      acceptedSent: response.acceptedSent,
      acceptedReceived: response.acceptedReceived
    };
  }

  static toCreateRequest(data: CreateInvitationData): InvitationCreateRequestDto {
    return {
      inviteeEmail: data.inviteeEmail,
      houseId: data.houseId
    };
  }
}
