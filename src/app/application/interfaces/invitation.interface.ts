import { Observable } from 'rxjs';
import { Invitation } from '../../domain/entities';
import {
    SendInvitationRequest,
    BulkInvitationRequest,
    InvitationActionRequest,
    InvitationFilterRequest,
    InvitationSummaryResult
} from '../dto/invitation.dto';

/**
 * Interface que define los casos de uso relacionados con invitaciones
 */
export interface IInvitationService {
    sendInvitation(request: SendInvitationRequest): Observable<Invitation>;
    sendBulkInvitations(request: BulkInvitationRequest): Observable<Invitation[]>;
    processInvitationAction(request: InvitationActionRequest): Observable<void>;
    getMyInvitations(filter: InvitationFilterRequest): Observable<Invitation[]>;
    getInvitationSummary(userId: number): Observable<InvitationSummaryResult>;
    getInvitationNotifications(userId: number): Observable<Invitation[]>;
    resendInvitation(invitationId: number): Observable<void>;
    getHouseInvitations(houseId: number): Observable<Invitation[]>;
    revokeExpiredInvitations(houseId: number): Observable<number>; // returns count
}

/**
 * Commands para operaciones de invitación
 */
export interface SendInvitationCommand {
    senderId: number;
    invitationData: SendInvitationRequest;
}

export interface ProcessInvitationCommand {
    userId: number;
    actionData: InvitationActionRequest;
}

export interface BulkInvitationCommand {
    senderId: number;
    bulkData: BulkInvitationRequest;
}

/**
 * Queries para consultas de invitación
 */
export interface GetInvitationsQuery {
    userId: number;
    filter: InvitationFilterRequest;
}

export interface GetInvitationDetailsQuery {
    invitationId: number;
    userId: number; // para verificar permisos
}
