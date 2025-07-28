import { Observable } from 'rxjs';
import { Settlement, BalanceSummary } from '../../domain/entities';
import {
    CreateSettlementRequest,
    SettlementBatchRequest,
    BalanceCalculationRequest,
    DebtSummaryRequest,
    DebtSummaryResult,
    OptimalSettlementRequest,
    OptimalSettlementResult
} from '../dto/settlement.dto';

/**
 * Interface que define los casos de uso relacionados con liquidaciones
 */
export interface ISettlementService {
    createSettlement(request: CreateSettlementRequest): Observable<Settlement>;
    createBatchSettlement(request: SettlementBatchRequest): Observable<Settlement[]>;
    getHouseSettlements(houseId: number, userId: number, startDate?: Date, endDate?: Date): Observable<Settlement[]>;
    getBalanceSummary(request: BalanceCalculationRequest): Observable<BalanceSummary>;
    getDebtSummary(request: DebtSummaryRequest): Observable<DebtSummaryResult[]>;
    calculateOptimalSettlements(request: OptimalSettlementRequest): Observable<OptimalSettlementResult>;
    getMyDebts(userId: number): Observable<DebtSummaryResult>;
    getMyCredits(userId: number): Observable<DebtSummaryResult>;
    markSettlementAsCompleted(settlementId: number, userId: number): Observable<void>;
    disputeSettlement(settlementId: number, userId: number, reason: string): Observable<void>;
    getSettlementHistory(houseId: number, userId: number): Observable<Settlement[]>;
}

/**
 * Commands para operaciones de liquidación
 */
export interface CreateSettlementCommand {
    creatorId: number;
    settlementData: CreateSettlementRequest;
}

export interface BatchSettlementCommand {
    creatorId: number;
    batchData: SettlementBatchRequest;
}

export interface MarkSettlementCompletedCommand {
    settlementId: number;
    userId: number;
    completionProof?: string; // URL de comprobante opcional
}

/**
 * Queries para consultas de liquidación
 */
export interface GetSettlementsQuery {
    houseId: number;
    userId: number;
    startDate?: Date;
    endDate?: Date;
    includeCompleted?: boolean;
}

export interface GetBalanceQuery {
    request: BalanceCalculationRequest;
    userId: number; // para verificar permisos
}
