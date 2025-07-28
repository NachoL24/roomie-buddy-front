import { Provider } from '@angular/core';
import {
  UserRepository,
  HouseRepository,
  InvitationRepository,
  ExpenseRepository,
  HouseExpenseRepository,
  PersonalExpenseRepository,
  IncomeRepository,
  SettlementRepository
} from '../../domain/repositories';
import {
  UserRestClient,
  HouseRestClient,
  InvitationRestClient,
  ExpenseRestClient,
  HouseExpenseRestClient,
  PersonalExpenseRestClient,
  IncomeRestClient,
  SettlementRestClient
} from '../rest-clients';

/**
 * Dependency Injection configuration for repositories.
 * This connects the domain repository interfaces with their concrete implementations.
 */
export const REPOSITORY_PROVIDERS: Provider[] = [
  {
    provide: UserRepository,
    useClass: UserRestClient
  },
  {
    provide: HouseRepository,
    useClass: HouseRestClient
  },
  {
    provide: InvitationRepository,
    useClass: InvitationRestClient
  },
  {
    provide: ExpenseRepository,
    useClass: ExpenseRestClient
  },
  {
    provide: HouseExpenseRepository,
    useClass: HouseExpenseRestClient
  },
  {
    provide: PersonalExpenseRepository,
    useClass: PersonalExpenseRestClient
  },
  {
    provide: IncomeRepository,
    useClass: IncomeRestClient
  },
  {
    provide: SettlementRepository,
    useClass: SettlementRestClient
  }
];
