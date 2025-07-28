import { Injectable } from '@angular/core';
import {
    UpdateUserProfileRequest,
    ChangePasswordRequest,
    UserPreferencesRequest
} from '../dto/user.dto';
import { BusinessValidationError } from '../exceptions/business-validation.error';

/**
 * Validador para reglas de negocio relacionadas con usuarios
 */
@Injectable({
    providedIn: 'root'
})
export class UserValidator {

    /**
     * Valida una solicitud de actualización de perfil
     */
    validateUpdateProfile(request: UpdateUserProfileRequest): void {
        this.validateName(request.firstName, 'firstName');
        this.validateName(request.lastName, 'lastName');

        if (request.email) {
            this.validateEmail(request.email);
        }

        if (request.phoneNumber) {
            this.validatePhoneNumber(request.phoneNumber);
        }
    }

    /**
     * Valida cambio de contraseña
     */
    validateChangePassword(request: ChangePasswordRequest): void {
        this.validatePassword(request.newPassword);

        if (request.newPassword !== request.confirmPassword) {
            throw new BusinessValidationError('Las contraseñas no coinciden');
        }

        if (request.currentPassword === request.newPassword) {
            throw new BusinessValidationError('La nueva contraseña debe ser diferente a la actual');
        }
    }

    /**
     * Valida preferencias de usuario
     */
    validateUserPreferences(request: UserPreferencesRequest): void {
        const validLanguages = ['es', 'en'];
        const validCurrencies = ['ARS', 'USD', 'EUR'];
        const validThemes = ['light', 'dark', 'auto'];

        if (!validLanguages.includes(request.language)) {
            throw new BusinessValidationError('Idioma no válido');
        }

        if (!validCurrencies.includes(request.currency)) {
            throw new BusinessValidationError('Moneda no válida');
        }

        if (!validThemes.includes(request.theme)) {
            throw new BusinessValidationError('Tema no válido');
        }
    }

    /**
     * Valida nombre (firstName/lastName)
     */
    private validateName(name: string | undefined, field: string): void {
        if (name === undefined) return;

        if (!name || name.trim().length === 0) {
            throw new BusinessValidationError(`${field} es requerido`);
        }

        if (name.length < 2) {
            throw new BusinessValidationError(`${field} debe tener al menos 2 caracteres`);
        }

        if (name.length > 50) {
            throw new BusinessValidationError(`${field} no puede tener más de 50 caracteres`);
        }

        // Solo letras, espacios y algunos caracteres especiales
        const nameRegex = /^[a-zA-ZáéíóúñÑÁÉÍÓÚ\s'-]+$/;
        if (!nameRegex.test(name)) {
            throw new BusinessValidationError(`${field} contiene caracteres inválidos`);
        }
    }

    /**
     * Valida email
     */
    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BusinessValidationError('Email no válido');
        }

        if (email.length > 100) {
            throw new BusinessValidationError('Email demasiado largo');
        }
    }

    /**
     * Valida número de teléfono
     */
    private validatePhoneNumber(phone: string): void {
        // Formato argentino o internacional básico
        const phoneRegex = /^[\+]?[1-9][\d]{7,14}$/;
        if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            throw new BusinessValidationError('Número de teléfono no válido');
        }
    }

    /**
     * Valida contraseña
     */
    private validatePassword(password: string): void {
        if (password.length < 8) {
            throw new BusinessValidationError('La contraseña debe tener al menos 8 caracteres');
        }

        if (password.length > 128) {
            throw new BusinessValidationError('La contraseña es demasiado larga');
        }

        // Al menos una mayúscula, una minúscula y un número
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
            throw new BusinessValidationError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
        }
    }
}
