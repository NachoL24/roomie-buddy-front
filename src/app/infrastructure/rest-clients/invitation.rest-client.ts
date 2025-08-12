import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvitationRepository, CreateInvitationData } from '../../domain/repositories';
import { Invitation, InvitationSummary } from '../../domain/entities';
import { InvitationMapper } from '../mappers';
import { InvitationResponseDto, InvitationSummaryResponseDto } from '../dtos';
import { API_BASE_URL } from '../../app.config';

@Injectable({
    providedIn: 'root'
})
export class InvitationRestClient extends InvitationRepository {
    constructor(
        private http: HttpClient,
        @Inject(API_BASE_URL) private apiBaseUrl: string
    ) {
        super();
    }

    createInvitation(data: CreateInvitationData): Observable<Invitation> {
        const request = InvitationMapper.toCreateRequest(data);
        return this.http.post<InvitationResponseDto>(`${this.apiBaseUrl}/invitations`, request)
            .pipe(map(InvitationMapper.fromResponse));
    }

    acceptInvitation(id: string): Observable<void> {
        return this.http.put<void>(`${this.apiBaseUrl}/invitations/${id}/accept`, {});
    }

    declineInvitation(id: string): Observable<void> {
        return this.http.put<void>(`${this.apiBaseUrl}/invitations/${id}/decline`, {});
    }

    cancelInvitation(id: string): Observable<void> {
        return this.http.put<void>(`${this.apiBaseUrl}/invitations/${id}/cancel`, {});
    }

    getMyInvitations(): Observable<Invitation[]> {
        return this.http.get<InvitationResponseDto[]>(`${this.apiBaseUrl}/invitations/my-invitations`)
            .pipe(map(invitations => invitations.map(InvitationMapper.fromResponse)));
    }

    getSentInvitations(): Observable<Invitation[]> {
        return this.http.get<InvitationResponseDto[]>(`${this.apiBaseUrl}/invitations/my-invitations/sent`)
            .pipe(map(invitations => invitations.map(InvitationMapper.fromResponse)));
    }

    getReceivedInvitations(): Observable<Invitation[]> {
        return this.http.get<InvitationResponseDto[]>(`${this.apiBaseUrl}/invitations/my-invitations/received`)
            .pipe(map(invitations => invitations.map(InvitationMapper.fromResponse)));
    }

    getInvitationSummary(): Observable<InvitationSummary> {
        return this.http.get<InvitationSummaryResponseDto>(`${this.apiBaseUrl}/invitations/my-invitations/summary`)
            .pipe(map(InvitationMapper.summaryFromResponse));
    }

    getNotifications(): Observable<Invitation[]> {
        return this.http.get<InvitationResponseDto[]>(`${this.apiBaseUrl}/invitations/notifications`)
            .pipe(map(invitations => invitations.map(i => InvitationMapper.fromResponse(i))));
    }

    getInvitationsByHouse(houseId: number): Observable<Invitation[]> {
        return this.http.get<InvitationResponseDto[]>(`${this.apiBaseUrl}/invitations/house/${houseId}`)
            .pipe(map(invitations => invitations.map(InvitationMapper.fromResponse)));
    }

    getInvitationsByUser(userId: number): Observable<Invitation[]> {
        return this.http.get<InvitationResponseDto[]>(`${this.apiBaseUrl}/invitations/user/${userId}`)
            .pipe(map(invitations => invitations.map(InvitationMapper.fromResponse)));
    }

    getPendingInvitationsByUser(userId: number): Observable<Invitation[]> {
        return this.http.get<InvitationResponseDto[]>(`${this.apiBaseUrl}/invitations/user/${userId}/pending`)
            .pipe(map(invitations => invitations.map(InvitationMapper.fromResponse)));
    }
}
