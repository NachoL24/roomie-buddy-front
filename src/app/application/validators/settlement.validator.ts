import { Injectable } from '@angular/core';
import {
    CreateSettlementRequest,
    SettlementType,
} from '../dto/settlement.dto';
import { BusinessValidationError } from '../exceptions/business-validation.error';

/**
 * Validador para reglas de negocio relacionadas con liquidaciones
 */
@Injectable({
    providedIn: 'root'
})
export class SettlementValidator {

    /**
     * Valida creación de liquidación
     */
    validateCreateSettlement(request: CreateSettlementRequest): void {

    }

    /**
     * Valida que el período de liquidación no se superponga
     */
    validateNonOverlappingPeriod(
        startDate: Date,
        endDate: Date,
        existingSettlements: Array<{ startDate: Date, endDate: Date }>
    ): void {
        const hasOverlap = existingSettlements.some(settlement => {
            return (startDate <= settlement.endDate && endDate >= settlement.startDate);
        });

        if (hasOverlap) {
            throw new BusinessValidationError('El período de liquidación se superpone con una liquidación existente');
        }
    }

    /**
     * Valida que haya transacciones en el período
     */
    validateHasTransactions(transactionCount: number): void {
        if (transactionCount === 0) {
            throw new BusinessValidationError('No hay transacciones en el período seleccionado para liquidar');
        }
    }

    /**
     * Valida montos de liquidación
     */
    validateSettlementAmounts(amounts: Array<{ memberId: number, amount: number }>): void {
        if (amounts.length === 0) {
            throw new BusinessValidationError('No hay montos para liquidar');
        }

        // Verificar que la suma total sea aproximadamente 0 (balance)
        const totalAmount = amounts.reduce((sum, item) => sum + item.amount, 0);
        const tolerance = 0.01; // Tolerancia para errores de redondeo

        if (Math.abs(totalAmount) > tolerance) {
            throw new BusinessValidationError('Los montos de liquidación no están balanceados');
        }

        // Verificar que todos los montos sean válidos
        amounts.forEach(item => {
            if (!Number.isFinite(item.amount)) {
                throw new BusinessValidationError('Monto de liquidación inválido');
            }

            if (Math.abs(item.amount) > 999999999) {
                throw new BusinessValidationError('Monto de liquidación demasiado alto');
            }
        });
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
     * Valida ID de liquidación
     */
    private validateSettlementId(settlementId: number): void {
        if (!Number.isInteger(settlementId) || settlementId <= 0) {
            throw new BusinessValidationError('ID de liquidación no válido');
        }
    }

    /**
     * Valida tipo de liquidación
     */
    private validateSettlementType(type: SettlementType): void {
        const validTypes = Object.values(SettlementType);
        if (!validTypes.includes(type)) {
            throw new BusinessValidationError('Tipo de liquidación no válido');
        }
    }

    /**
     * Valida rango de fechas
     */
    private validateDateRange(startDate: Date, endDate: Date): void {
        const now = new Date();

        if (startDate >= endDate) {
            throw new BusinessValidationError('La fecha de inicio debe ser anterior a la fecha de fin');
        }

        if (endDate > now) {
            throw new BusinessValidationError('No se puede liquidar un período futuro');
        }

        // Verificar que el período no sea demasiado largo (más de 1 año)
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        if (endDate.getTime() - startDate.getTime() > oneYear) {
            throw new BusinessValidationError('El período de liquidación no puede ser mayor a un año');
        }

        // Verificar que el período no sea demasiado corto (menos de 1 día)
        const oneDay = 24 * 60 * 60 * 1000;
        if (endDate.getTime() - startDate.getTime() < oneDay) {
            throw new BusinessValidationError('El período de liquidación debe ser de al menos un día');
        }
    }

    /**
     * Valida descripción
     */
    private validateDescription(description: string): void {
        if (description.length > 500) {
            throw new BusinessValidationError('La descripción no puede tener más de 500 caracteres');
        }
    }

    /**
     * Valida notas
     */
    private validateNotes(notes: string): void {
        if (notes.length > 1000) {
            throw new BusinessValidationError('Las notas no pueden tener más de 1000 caracteres');
        }
    }

    /**
     * Valida tipo de acción
     */
    private validateActionType(action: string): void {
        const validActions = ['APPROVE', 'REJECT', 'FINALIZE', 'REOPEN'];
        if (!validActions.includes(action)) {
            throw new BusinessValidationError('Tipo de acción no válido');
        }
    }
}
