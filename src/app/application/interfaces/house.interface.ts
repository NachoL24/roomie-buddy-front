import { Observable } from 'rxjs';
import { House } from '../../domain/entities';
import { PayRatioUpdate } from '../../domain/repositories';
import {
  CreateHouseRequest,
  UpdateHouseRequest,
  HouseSettingsRequest,
  AddMemberRequest,
  UpdateMemberRoleRequest,
  HouseStatisticsRequest,
  LeaveHouseRequest
} from '../dto/house.dto';

/**
 * Interface que define los casos de uso relacionados con casas
 */
export interface IHouseService {
  getHouseById(id: number): Observable<House>;
  getMyHouses(roomieId: number): Observable<House[]>;
  createHouse(request: CreateHouseRequest): Observable<House>;
  updateHouse(houseId: number, request: UpdateHouseRequest): Observable<House>;
  updateHouseSettings(houseId: number, settings: HouseSettingsRequest): Observable<void>;
  addMember(request: AddMemberRequest): Observable<void>;
  updateMemberRole(request: UpdateMemberRoleRequest): Observable<void>;
  updatePayRatios(houseId: number, payRatios: PayRatioUpdate[]): Observable<void>;
  removeMember(houseId: number, memberId: number): Observable<void>;
  leaveHouse(request: LeaveHouseRequest): Observable<void>;
  deleteHouse(id: number): Observable<void>;
  getHouseStatistics(request: HouseStatisticsRequest): Observable<any>;
  transferHouseOwnership(houseId: number, newOwnerId: number): Observable<void>;
}

/**
 * Commands para operaciones de casa
 */
export interface CreateHouseCommand {
  creatorId: number;
  houseData: CreateHouseRequest;
}

export interface UpdatePayRatiosCommand {
  houseId: number;
  payRatios: PayRatioUpdate[];
  updatedBy: number;
}

export interface AddMemberCommand {
  houseId: number;
  memberData: AddMemberRequest;
  addedBy: number;
}

/**
 * Queries para consultas de casa
 */
export interface GetUserHousesQuery {
  userId: number;
  includeMembers?: boolean;
  includeStatistics?: boolean;
  houseType?: 'PERSONAL' | 'SHARED' | 'FAMILY';
}

export interface GetHouseDetailsQuery {
  houseId: number;
  userId: number; // para verificar permisos
  includeFinancialSummary?: boolean;
}
