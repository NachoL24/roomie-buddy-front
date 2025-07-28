import { Invitation, InvitationStatus, InvitationSummary } from '../../domain/entities';
import { InvitationResponseDto, InvitationSummaryResponseDto, InvitationCreateRequestDto } from '../dtos';
import { CreateInvitationData } from '../../domain/repositories';

export class InvitationMapper {
    static fromResponse(response: InvitationResponseDto): Invitation {
        return {
            id: response.id,
            inviterRoomieId: response.inviterRoomieId,
            inviteeEmail: response.inviteeEmail,
            houseId: response.houseId,
            status: response.status as InvitationStatus,
            createdAt: new Date(response.createdAt),
            respondedAt: response.respondedAt ? new Date(response.respondedAt) : undefined
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
