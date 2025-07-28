import { Injectable } from '@angular/core';
import {
    SendInvitationRequest,
    InvitationActionRequest,
    InvitationAction,
    BulkInvitationRequest
} from '../dto/invitation.dto';
import { BusinessValidationError } from '../exceptions/business-validation.error';

/**
 * Validador para reglas de negocio relacionadas con invitaciones
 */
@Injectable({
    providedIn: 'root'
})
export class InvitationValidator {

    /**
     * Valida envío de invitación
     */
    validateSendInvitation(request: SendInvitationRequest): void {
        this.validateEmail(request.inviteeEmail);
        this.validateRole(request.role);
        this.validateHouseId(request.houseId);

        if (request.suggestedPayRatio !== undefined) {
            this.validatePayRatio(request.suggestedPayRatio);
        }

        if (request.personalMessage) {
            this.validateCustomMessage(request.personalMessage);
        }
    }

    /**
     * Valida invitación masiva
     */
    validateBulkInvitation(request: BulkInvitationRequest): void {
        this.validateHouseId(request.houseId);

        if (request.invitations.length === 0) {
            throw new BusinessValidationError('Debe incluir al menos una invitación');
        }

        if (request.invitations.length > 20) {
            throw new BusinessValidationError('No puede enviar más de 20 invitaciones a la vez');
        }

        request.invitations.forEach((invitation, index) => {
            try {
                this.validateEmail(invitation.email);
                this.validateRole(invitation.role);

                if (invitation.payRatio !== undefined) {
                    this.validatePayRatio(invitation.payRatio);
                }
            } catch (error: any) {
                throw new BusinessValidationError(`Error en invitación ${index + 1}: ${error?.message || 'Error desconocido'}`);
            }
        });

        if (request.commonMessage) {
            this.validateCustomMessage(request.commonMessage);
        }
    }

    /**
     * Valida acción sobre invitación
     */
    validateInvitationAction(request: InvitationActionRequest): void {
        this.validateInvitationId(request.invitationId);
        this.validateInvitationActionType(request.action);

        if (request.message) {
            this.validateResponseMessage(request.message);
        }
    }

    /**
     * Valida que la invitación esté pendiente
     */
    validateInvitationStatus(status: string): void {
        if (status !== 'PENDING') {
            throw new BusinessValidationError('La invitación ya ha sido procesada');
        }
    }

    /**
     * Valida expiración de invitación
     */
    validateInvitationExpiry(expiresAt: Date): void {
        const now = new Date();
        if (expiresAt < now) {
            throw new BusinessValidationError('La invitación ha expirado');
        }
    }

    /**
     * Valida límite de invitaciones pendientes
     */
    validatePendingInvitationsLimit(currentPendingCount: number, maxPending: number = 10): void {
        if (currentPendingCount >= maxPending) {
            throw new BusinessValidationError(`No puedes tener más de ${maxPending} invitaciones pendientes`);
        }
    }

    /**
     * Valida ID de casa
     */
    private validateHouseId(houseId: number): void {
        if (!Number.isInteger(houseId) || houseId <= 0) {
            throw new BusinessValidationError('ID de casa no válido');
        }
    }

    /**
     * Valida ID de invitación
     */
    private validateInvitationId(invitationId: number): void {
        if (!Number.isInteger(invitationId) || invitationId <= 0) {
            throw new BusinessValidationError('ID de invitación no válido');
        }
    }

    /**
     * Valida email
     */
    private validateEmail(email: string): void {
        if (!email || email.trim().length === 0) {
            throw new BusinessValidationError('El email es requerido');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BusinessValidationError('Email no válido');
        }

        if (email.length > 100) {
            throw new BusinessValidationError('Email demasiado largo');
        }
    }

    /**
     * Valida rol
     */
    private validateRole(role: string): void {
        const validRoles = ['ADMIN', 'MEMBER', 'VIEWER'];
        if (!validRoles.includes(role)) {
            throw new BusinessValidationError('Rol no válido');
        }
    }

    /**
     * Valida ratio de pago
     */
    private validatePayRatio(payRatio: number): void {
        if (payRatio < 0) {
            throw new BusinessValidationError('El ratio de pago no puede ser negativo');
        }

        if (payRatio > 100) {
            throw new BusinessValidationError('El ratio de pago no puede ser mayor a 100%');
        }

        // Verificar que tenga máximo 2 decimales
        if (!/^\d+(\.\d{1,2})?$/.test(payRatio.toString())) {
            throw new BusinessValidationError('El ratio de pago debe tener máximo 2 decimales');
        }
    }

    /**
     * Valida mensaje personalizado
     */
    private validateCustomMessage(message: string): void {
        if (message.length > 500) {
            throw new BusinessValidationError('El mensaje personalizado no puede tener más de 500 caracteres');
        }

        // Verificar contenido apropiado (básico)
        const inappropriateWords = ['spam', 'scam', 'phishing'];
        const lowercaseMessage = message.toLowerCase();

        if (inappropriateWords.some(word => lowercaseMessage.includes(word))) {
            throw new BusinessValidationError('El mensaje contiene contenido inapropiado');
        }
    }

    /**
     * Valida acción de invitación
     */
    private validateInvitationActionType(action: InvitationAction): void {
        const validActions = Object.values(InvitationAction);
        if (!validActions.includes(action)) {
            throw new BusinessValidationError('Acción de invitación no válida');
        }
    }

    /**
     * Valida mensaje de respuesta
     */
    private validateResponseMessage(message: string): void {
        if (message.length > 300) {
            throw new BusinessValidationError('El mensaje de respuesta no puede tener más de 300 caracteres');
        }
    }
}
