import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvitationRepository, CreateInvitationData } from '../../domain/repositories';
import { Invitation, InvitationSummary } from '../../domain/entities';

@Injectable({
    providedIn: 'root'
})
export class InvitationService {
    constructor(private invitationRepository: InvitationRepository) { }

    inviteUserToHouse(inviteeEmail: string, houseId: number): Observable<Invitation> {
        const data: CreateInvitationData = { inviteeEmail, houseId };
        return this.invitationRepository.createInvitation(data);
    }

    acceptInvitation(invitationId: string): Observable<void> {
        return this.invitationRepository.acceptInvitation(invitationId);
    }

    declineInvitation(invitationId: string): Observable<void> {
        return this.invitationRepository.declineInvitation(invitationId);
    }

    cancelInvitation(invitationId: string): Observable<void> {
        return this.invitationRepository.cancelInvitation(invitationId);
    }

    getMyInvitations(): Observable<Invitation[]> {
        return this.invitationRepository.getMyInvitations();
    }

    getSentInvitations(): Observable<Invitation[]> {
        return this.invitationRepository.getSentInvitations();
    }

    getReceivedInvitations(): Observable<Invitation[]> {
        return this.invitationRepository.getReceivedInvitations();
    }

    getInvitationSummary(): Observable<InvitationSummary> {
        return this.invitationRepository.getInvitationSummary();
    }

    getInvitationNotifications(): Observable<Invitation[]> {
        return this.invitationRepository.getNotifications();
    }

    getHouseInvitations(houseId: number): Observable<Invitation[]> {
        return this.invitationRepository.getInvitationsByHouse(houseId);
    }

    getUserInvitations(userId: number): Observable<Invitation[]> {
        return this.invitationRepository.getInvitationsByUser(userId);
    }

    getPendingUserInvitations(userId: number): Observable<Invitation[]> {
        return this.invitationRepository.getPendingInvitationsByUser(userId);
    }
}
