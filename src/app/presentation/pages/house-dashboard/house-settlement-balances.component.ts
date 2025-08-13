import { Component, computed, inject, Input, OnChanges, OnInit, SimpleChanges, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { SettlementService } from "@application/use-cases";
import { House, HouseBalanceSummary } from "@domain/entities";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-house-balance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="balances">
      <h2>Balances</h2>
      @if (data()) {
      <div>
        @if (entries().length) {
          <mat-card appearance="outlined" class="details">
            @for (e of entries(); track e.id) {
              <div class="detail">
                @if (e.member?.picture) {
                  <img class="avatar" [src]="e.member!.picture!" [alt]="(e.member!.firstName + ' ' + e.member!.lastName)" alt="avatar" loading="eager" fetchpriority="high" decoding="async" width="40" height="40"/>
                } @else {
                  <div class="avatar">{{ initials(e.member?.firstName, e.member?.lastName) }}</div>
                }
                <div class="person-details">
                  <div class="name">{{ e.member?.firstName }} {{ e.member?.lastName }}</div>
                  <div class="status">
                    @if (e.amount > 0) {
                      <span class="positive">Te debe {{ e.amount | number:'1.2-2' }}</span>
                    } @else if (e.amount < 0) {
                      <span class="negative">Le debes {{ (-e.amount) | number:'1.2-2' }}</span>
                    } @else {
                      <span>Están al día</span>
                    }
                  </div>
                </div>
              </div>
            }
          </mat-card>
        } @else {
          <div class="loading">
          <div class="empty">Estas al día</div>
          </div>
        }
      </div>
      } @else {
        <div class="loading">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        </div>
      }

    </div>
  `,
  styles: [`
    h2 {
      font-size: 24px;
      margin-bottom: 12px;
    }
    .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px; }
    .item { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 8px; background: var(--mat-sys-surface-variant); }
    .label { font-size: 12px; color: var(--mat-sys-on-surface-variant); }
    .value { font-size: 18px; font-weight: 600; }
    .positive { color: var(--mat-sys-primary); }
    .negative { color: var(--mat-sys-error); }
    .details { display: grid; gap: 8px; }
  .detail { display: flex; flex-direction: row; gap: 12px; align-items: center; padding: 10px; }
  .person { display: flex; align-items: center; justify-content: start; }
  .avatar { width: 28px; height: 28px; border-radius: 50%; background: #f0d7cd; display: inline-flex; align-items: center; justify-content: center; font-weight: 600; color: #6a4a3c; }
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  h3 { margin: 8px 0 4px; font-size: 14px; color: var(--mat-sys-on-surface-variant); }
    .empty { color: var(--mat-sys-on-surface-variant); padding: 8px; }
    .person-details { display: flex; flex-direction: column; gap: 0; }
  `]
})
export class HouseSettlementBalancesComponent implements OnInit, OnChanges {
  settlementService = inject(SettlementService);

  @Input() house!: House;

  // Signals for state
  private houseSig = signal<House | null>(null);
  data = signal<HouseBalanceSummary | null>(null);
  loading = signal<boolean>(false);

  // Derived computed lists with member info
  entries = computed(() => {
    const summary = this.data();
    const h = this.houseSig();
    if (!summary || !h) return [] as Array<{ id: number; amount: number; description: string; member?: House['members'][number] }>;
    return summary.detailedBalances.map(d => ({
      id: d.withRoomieId,
      amount: d.amount,
      description: d.description,
      member: h.members.find(m => m.id === d.withRoomieId)
    }));
  });

  owesMe = computed(() => this.entries().filter(e => e.amount > 0));
  iOwe = computed(() => this.entries().filter(e => e.amount < 0));

  // Totals
  totalOwesToMe = computed(() => {
    const d = this.data();
    if (d && d.myBalance) return d.myBalance.owesToMe;
    return this.owesMe().reduce((sum, e) => sum + e.amount, 0);
  });

  totalIOwe = computed(() => {
    const d = this.data();
    if (d && d.myBalance) return d.myBalance.iOwe;
    return this.iOwe().reduce((sum, e) => sum + Math.abs(e.amount), 0);
  });

  netBalance = computed(() => {
    const d = this.data();
    if (d && d.myBalance) return d.myBalance.netBalance;
    return this.totalOwesToMe() - this.totalIOwe();
  });

  ngOnInit(): void {
    // Ensure initial value is captured and fetch
    if (this.house) this.houseSig.set(this.house);
    const h = this.houseSig();
    if (!h) return;
    this.fetchSummary(h.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['house']) {
      this.houseSig.set(this.house);
      if (this.house) this.fetchSummary(this.house.id);
    }
  }

  initials(first?: string, last?: string): string {
    const f = (first || '').trim();
    const l = (last || '').trim();
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
  }

  private fetchSummary(houseId: number) {
    this.loading.set(true);
    this.data.set(null);
    this.settlementService.getMyHouseBalanceSummary(houseId).subscribe(summary => {
      console.log('Balance summary:', summary);
      this.data.set(summary);
      this.loading.set(false);
    }, error => {
      console.error('Error fetching balance summary:', error);
      this.loading.set(false);
    });
  }
}
