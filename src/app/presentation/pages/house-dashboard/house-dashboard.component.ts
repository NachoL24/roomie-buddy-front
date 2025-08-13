import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HouseService, FinancialActivityService } from '@application/use-cases';
import { FinancialActivity, FinancialActivityType, House } from '@domain/entities';
import { NewHouseExpenseDialogComponent } from '@presentation/pages/house-dashboard/new-house-expense-dialog.component';
import { InviteMemberDialogComponent } from '@presentation/pages/house-dashboard/invite-member-dialog.component';
import { HouseExpenseCardComponent } from '@presentation/shared/ui/house-expense-card/house-expense-card.component';
import { PayRatioDialogComponent } from './pay-ratio-dialog.component';
import { HouseSettlementBalancesComponent } from './house-settlement-balances.component';
import { HouseInvitationListComponent } from "./house-invitation-list.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationService } from '@presentation/shared/services';

@Component({
  selector: 'app-house-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatPaginatorModule, HouseExpenseCardComponent, HouseSettlementBalancesComponent, NgOptimizedImage, HouseInvitationListComponent, MatTooltipModule],
  template: `
  @if (house()) {
    <div class="house-dashboard">
        <div class="house-title-row">
          @if (!isEditingName()) {
            <h1 class="house-title">{{ house()?.name }}</h1>
            <button mat-icon-button (click)="startEditName()" [disabled]="!house()" matTooltip="Editar nombre">
              <mat-icon>edit</mat-icon>
            </button>
          } @else {
            <div class="edit-house-name">
              <input class="name-input" [value]="nameDraft()" (input)="nameDraft.set(($any($event.target).value))" [disabled]="saving()" />
              <button mat-icon-button color="primary" (click)="saveEditName()" [disabled]="saving() || !nameDraft().trim()" matTooltip="Guardar">
                <mat-icon>check</mat-icon>
              </button>
              <button mat-icon-button (click)="cancelEditName()" [disabled]="saving()" matTooltip="Cancelar">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
        </div>


      <div class="content">
        <section class="transactions">
          <div class="header">
            <div class="header-content">
            <h2 class="table-title">Transacciones</h2>
            <mat-icon class="info-icon" matTooltip="{{navigationService.isMobile() ? 'Manten presionado' : 'Click derecho en'}} una transacción para más opciones">info</mat-icon>
            </div>
            <button class="new-transaction-button" mat-flat-button color="primary" (click)="openNewExpense()">
              <mat-icon>add</mat-icon>
              Nueva Transacción
            </button>
          </div>
          @if (activities().length) {
            <div class="card-list">
              @for (act of activities(); track act.id) {
                <app-house-expense-card [activity]="act" [house]="house()!" (deleted)="refresh(house()!.id)" (updated)="refresh(house()!.id)" />
              }
            </div>
          } @else {
            <div class="empty">No hay transacciones aún</div>
          }

          <mat-paginator
            [length]="totalCount()"
            [pageIndex]="pageIndex()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="pageSizeOptions"
            (page)="onPage($event)"
            class="paginator"
          />
        </section>

        <aside class="members">
          <div class="header">
            <h2 class="table-title">Members</h2>
            <div class="buttons">
              <button mat-icon-button (click)="openInvite()">
                <mat-icon>group_add</mat-icon>
              </button>
              <button mat-icon-button (click)="openSettings()">
                <mat-icon>settings</mat-icon>
              </button>
            </div>
          </div>
          <ul class="member-list">
            <li *ngFor="let m of house()?.members" class="member-item">
               @if (m.picture) {
                <img class="avatar" [ngSrc]="m.picture!" width="40" height="40" [alt]="m.firstName + ' ' + m.lastName" alt="avatar" loading="eager" fetchpriority="high" decoding="async"/>
               } @else {
              <div class="avatar">
                {{ initials(m.firstName, m.lastName) }}
              </div>
               }
              <div class="info">
                <div class="name">{{ m.firstName }} {{ m.lastName }}</div>
                <div class="email text-muted">Ratio: {{ m.payRatioPercentage || (m.payRatio * 100)+'%' || 0 }}</div>
              </div>
            </li>
          </ul>
          <section class="balances-section">
            <app-house-balance [house]="house()!"></app-house-balance>
          </section>
          <section class="invitations-section">
            @if (!!house()?.id) {
              <app-house-invitation-list [houseId]="house()!.id"></app-house-invitation-list>
            }
          </section>
        </aside>
      </div>

    </div>
          } @else {
            <div class="loading">Loading...</div>
          }
  `,
  styles: [`
    :host { display: block; }
    .house-title {
      margin-top: 8px;
    }
    .house-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .edit-house-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .name-input {
      font-size: 1.8rem;
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid var(--mat-sys-outline-variant);
      color: var(--mat-sys-on-surface);
      background: var(--mat-sys-surface);
    }
    .header-content {
      display: flex;
      align-items: center;
    }

    .info-icon {
      margin-left: 4px;
      font-size: 15px;
      color: var(--mat-sys-on-surface);
    }
    .house-dashboard {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 8px;
    }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    h1 { font-size: 32px; margin: 0; }
    .table-title { margin: 0; }
    .content {
      display: grid;
      grid-template-columns: 1fr minmax(200px, 260px);
      gap: 24px;
    }
  .card-list { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .activity-card { border-left: 4px solid var(--mat-sys-outline-variant); border-radius: 12px; padding: 12px; }
  .activity-card.expense { border-left-color: var(--mat-sys-primary); }
  .activity-card.settlement { border-left-color: var(--mat-sys-secondary); }
  .transaction-content { display: flex; align-items: center; gap: 16px; }
  .transaction-left { display: flex; align-items: center; gap: 10px; height: 40px; }
  .transaction-icon { position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: var(--mat-sys-surface-variant); }
  .expense-icon { color: var(--mat-sys-error); }
  .settlement-icon { color: var(--mat-sys-secondary); }
  .payer-avatar { width: 20px; height: 20px; border-radius: 50%; overflow: hidden; background: #f0d7cd; display: inline-flex; align-items: center; justify-content: center; font-weight: 600; color: #6a4a3c; position: absolute; bottom: -6px; left: -6px; }
  .payer-avatar.initials { font-size: 10px; }
  .transaction-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .transaction-description { font-size: 1.05rem; font-weight: 500; color: var(--mat-sys-on-surface); }
  .transaction-payer { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); }
  .payer-name { color: var(--mat-sys-on-surface); font-weight: 500; }
  .transaction-date { font-size: 0.9rem; color: var(--mat-sys-on-surface-variant); }
  .transaction-amount-container { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
  .transaction-amount { font-size: 1.2rem; font-weight: 600; }
  .expense-amount { color: var(--mat-sys-primary); }
  .settlement-amount { color: var(--mat-sys-secondary); }
    .empty { padding: 24px; color: var(--mat-sys-on-surface-variant); border: 1px dashed var(--mat-sys-outline-variant); border-radius: 12px; }
    .members { display: flex; flex-direction: column; }
    .member-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
    .member-item { display: flex; gap: 12px; align-items: center; padding: 8px; border-radius: 12px; border: 1px solid var(--mat-sys-outline-variant); }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #f0d7cd; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #6a4a3c; }
    .info .name { font-weight: 600; }
    .text-muted { color: var(--mat-sys-on-surface-variant); margin-top: 2px; font-size: 12px; }
    .invite { width: 100%; }
    .loading { color: var(--mat-sys-on-surface-variant); }
    .buttons {
      display: flex;
      gap: 4px;
    }
    @media (max-width: 870px) {
      .content {
        grid-template-columns: 1fr;
        margin-bottom: 16px;
      }

      .member-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        grid-gap: 16px;
        gap: 16px;
      }
    }

    @media (max-width: 600px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 16px;
      }
      .new-transaction-button {
        width: 100%;
      }
    }

    @media (max-width: 450px) {
      .paginator {
        margin-top: 8px;
      }
    }
  `]
})
export class HouseDashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private houseService = inject(HouseService);
  navigationService = inject(NavigationService);
  private activityService = inject(FinancialActivityService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  house = signal<House | null>(null);
  activities = signal<FinancialActivity[]>([]);
  protected activityType = FinancialActivityType;
  totalCount = signal<number>(0);
  pageIndex = signal<number>(0); // 0-based for MatPaginator
  pageSize = signal<number>(10);
  readonly pageSizeOptions = [5, 10, 20, 50];

  // Inline edit state for house name
  isEditingName = signal<boolean>(false);
  nameDraft = signal<string>('');
  saving = signal<boolean>(false);

  ngOnInit(): void {
    // Initial load
    const initialId = Number(this.route.snapshot.paramMap.get('id'));
    if (initialId) {
      // Defer to next microtask to avoid ExpressionChangedAfterItHasBeenCheckedError
      queueMicrotask(() => this.refresh(initialId));
    }

    // Also refresh on every navigation end (covers same-URL navigations)
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) this.refresh(id);
      }
    });
  }

  refresh(houseId: number, pageIdx?: number, size?: number) {
    const effectivePageIndex = pageIdx ?? this.pageIndex();
    const effectivePageSize = size ?? this.pageSize();
    this.houseService.getHouseById(houseId).subscribe(h => { this.house.set(h); console.log("en componente:", h); });
    this.activityService.getHouseFinancialActivities(houseId, undefined, undefined, effectivePageIndex + 1, effectivePageSize).subscribe(page => {
      const sorted = [...page.items].sort((a, b) => b.date.getTime() - a.date.getTime());
      this.activities.set(sorted);
      this.totalCount.set(page.totalCount);
      // Sync with server response in case it adjusts values
      this.pageIndex.set(Math.max(0, (page.page ?? (effectivePageIndex + 1)) - 1));
      this.pageSize.set(page.pageSize ?? effectivePageSize);
    });
  }

  onPage(evt: PageEvent) {
    if (!this.house()) return;
    this.pageIndex.set(evt.pageIndex);
    this.pageSize.set(evt.pageSize);
    this.refresh(this.house()!.id, evt.pageIndex, evt.pageSize);
  }

  initials(first?: string, last?: string): string {
    const f = (first || '').trim();
    const l = (last || '').trim();
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
  }

  initialsFromName(name?: string): string {
    const n = (name || '').trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    const first = parts[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  openNewExpense() {
    if (!this.house()) return;
    const ref = this.dialog.open(NewHouseExpenseDialogComponent, { data: { house: this.house()! } });
    ref.afterClosed().subscribe(ok => {
      if (ok && this.house()) {
        this.snackBar.open('Transacción creada', 'Cerrar', { duration: 2500 });
        this.refresh(this.house()!.id);
      }
    });
  }

  openInvite() {
    if (!this.house()) return;
    const ref = this.dialog.open(InviteMemberDialogComponent, { data: { houseId: this.house()!.id, roomies: this.house()!.members } });
    ref.afterClosed().subscribe(ok => {
      if (ok && this.house()) {
        this.snackBar.open('Invitación enviada', 'Cerrar');
        this.refresh(this.house()!.id);
      }
    });
  }

  openSettings() {
    if (!this.house()) return;
    const ref = this.dialog.open(PayRatioDialogComponent, {
      data: { houseId: this.house()!.id, members: this.house()!.members }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok && this.house()) {
        this.snackBar.open('Ratios actualizados', 'Cerrar', { duration: 2500 });
        this.refresh(this.house()!.id);
      }
    });
  }

  // --- Inline edit handlers ---
  startEditName() {
    if (!this.house()) return;
    this.nameDraft.set(this.house()!.name);
    this.isEditingName.set(true);
  }

  cancelEditName() {
    this.isEditingName.set(false);
    this.nameDraft.set('');
  }

  saveEditName() {
    if (!this.house()) return;
    const newName = this.nameDraft().trim();
    if (!newName) return;
    if (newName === this.house()!.name) {
      this.cancelEditName();
      return;
    }
    this.saving.set(true);
    this.houseService.updateHouseName(this.house()!.id, newName).subscribe({
      next: (updated) => {
        this.house.set({ ...this.house()!, name: updated.name });
        this.houseService.triggerRefresh();
        this.snackBar.open('Nombre actualizado', 'Cerrar', { duration: 2500 });
        this.isEditingName.set(false);
        this.saving.set(false);
      },
      error: (e: any) => {
        console.error('Error updating house name:', e);
        this.snackBar.open('No se pudo actualizar el nombre', 'Cerrar', { duration: 3000 });
        this.saving.set(false);
      }
    });
  }

}
