import { Injectable } from '@angular/core';
import {
    CreateHouseRequest,
    UpdateHouseRequest,
    HouseType
} from '../dto/house.dto';
import { BusinessValidationError } from '../exceptions/business-validation.error';

/**
 * Validador para reglas de negocio relacionadas con casas
 */
@Injectable({
    providedIn: 'root'
})
export class HouseValidator {

    /**
     * Valida creación de casa
     */
    validateCreateHouse(request: CreateHouseRequest): void {
        this.validateHouseName(request.name);
        this.validateHouseType(request.houseType);

        if (request.description) {
            this.validateDescription(request.description);
        }

        if (request.initialMembers) {
            this.validateInitialMembers(request.initialMembers);
        }
    }

    /**
     * Valida actualización de casa
     */
    validateUpdateHouse(request: UpdateHouseRequest): void {
        if (request.name !== undefined) {
            this.validateHouseName(request.name);
        }

        if (request.description !== undefined) {
            this.validateDescription(request.description);
        }
    }

    /**
     * Valida que el usuario sea owner de la casa
     */
    validateOwnership(ownerId: string, currentUserId: string): void {
        if (ownerId !== currentUserId) {
            throw new BusinessValidationError('No tienes permisos para realizar esta acción');
        }
    }

    /**
     * Valida configuraciones de casa
     */
    validateHouseSettings(request: any): void {
        if (request.paymentDayOfMonth < 1 || request.paymentDayOfMonth > 31) {
            throw new BusinessValidationError('El día de pago debe estar entre 1 y 31');
        }

        const validCurrencies = ['ARS', 'USD', 'EUR'];
        if (!validCurrencies.includes(request.defaultCurrency)) {
            throw new BusinessValidationError('Moneda no válida');
        }

        if (request.approvalThresholdAmount < 0) {
            throw new BusinessValidationError('El monto de aprobación no puede ser negativo');
        }
    }

    /**
     * Valida agregar miembro
     */
    validateAddMember(request: any): void {
        this.validateEmail(request.email);

        const validRoles = ['ADMIN', 'MEMBER', 'VIEWER'];
        if (!validRoles.includes(request.role)) {
            throw new BusinessValidationError('Rol no válido');
        }

        if (request.payRatio !== undefined) {
            if (request.payRatio < 0 || request.payRatio > 100) {
                throw new BusinessValidationError('El ratio de pago debe estar entre 0 y 100');
            }
        }
    }

    /**
     * Valida emails iniciales
     */
    private validateInitialMembers(emails: string[]): void {
        if (emails.length > 10) {
            throw new BusinessValidationError('No puedes invitar más de 10 miembros iniciales');
        }

        emails.forEach(email => this.validateEmail(email));
    }

    /**
     * Valida email
     */
    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BusinessValidationError('Email no válido');
        }
    }

    /**
     * Valida nombre de casa
     */
    private validateHouseName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new BusinessValidationError('El nombre de la casa es requerido');
        }

        if (name.length < 3) {
            throw new BusinessValidationError('El nombre debe tener al menos 3 caracteres');
        }

        if (name.length > 100) {
            throw new BusinessValidationError('El nombre no puede tener más de 100 caracteres');
        }

        // Caracteres alfanuméricos, espacios y algunos especiales
        const nameRegex = /^[a-zA-Z0-9áéíóúñÑÁÉÍÓÚ\s\-_.]+$/;
        if (!nameRegex.test(name)) {
            throw new BusinessValidationError('El nombre contiene caracteres inválidos');
        }
    }

    /**
     * Valida tipo de casa
     */
    private validateHouseType(type: HouseType): void {
        const validTypes = Object.values(HouseType);
        if (!validTypes.includes(type)) {
            throw new BusinessValidationError('Tipo de casa no válido');
        }
    }

    /**
     * Valida descripción
     */
    private validateDescription(description: string): void {
        if (description.length > 1000) {
            throw new BusinessValidationError('La descripción no puede tener más de 1000 caracteres');
        }
    }
}
