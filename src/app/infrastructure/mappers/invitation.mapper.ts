import { Invitation, InvitationStatus, InvitationSummary } from '../../domain/entities';
import { InvitationResponse, InvitationSummaryResponse, CreateInvitationRequest } from '../dtos';
import { CreateInvitationData } from '../../domain/repositories';

export class InvitationMapper {
    static fromResponse(response: InvitationResponse): Invitation {
        return {
            id: response.id,
            inviteeEmail: response.inviteeEmail,
            houseId: response.houseId,
            houseName: response.houseName,
            inviterName: response.inviterName,
            status: response.status as InvitationStatus,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.updatedAt)
        };
    }

    static summaryFromResponse(response: InvitationSummaryResponse): InvitationSummary {
        return {
            totalSent: response.totalSent,
            totalReceived: response.totalReceived,
            pendingSent: response.pendingSent,
            pendingReceived: response.pendingReceived,
            acceptedSent: response.acceptedSent,
            acceptedReceived: response.acceptedReceived
        };
    }

    static toCreateRequest(data: CreateInvitationData): CreateInvitationRequest {
        return {
            inviteeEmail: data.inviteeEmail,
            houseId: data.houseId
        };
    }
}
