import { Observable } from 'rxjs';
import { Invitation, InvitationSummary } from '../../domain/entities';

export interface CreateInvitationData {
    inviteeEmail: string;
    houseId: number;
}

export abstract class InvitationRepository {
    abstract createInvitation(data: CreateInvitationData): Observable<Invitation>;
    abstract acceptInvitation(id: string): Observable<void>;
    abstract declineInvitation(id: string): Observable<void>;
    abstract cancelInvitation(id: string): Observable<void>;
    abstract getMyInvitations(): Observable<Invitation[]>;
    abstract getSentInvitations(): Observable<Invitation[]>;
    abstract getReceivedInvitations(): Observable<Invitation[]>;
    abstract getInvitationSummary(): Observable<InvitationSummary>;
    abstract getNotifications(): Observable<Invitation[]>;
    abstract getInvitationsByHouse(houseId: number): Observable<Invitation[]>;
    abstract getInvitationsByUser(userId: number): Observable<Invitation[]>;
    abstract getPendingInvitationsByUser(userId: number): Observable<Invitation[]>;
}
