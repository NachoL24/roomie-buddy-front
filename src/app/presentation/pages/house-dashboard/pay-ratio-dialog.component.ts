import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { HouseMember } from '@domain/entities';
import { HouseService } from '@application/use-cases';

interface DialogData {
  houseId: number;
  members: HouseMember[];
}

@Component({
  selector: 'app-pay-ratio-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatSliderModule],
  template: `
    <h2 mat-dialog-title>Configurar ratios de pago</h2>
    <div mat-dialog-content class="content">
      @if (values.length) {
        <div class="row header">
          <div>Miembro</div>
          <div>Porcentaje</div>
        </div>
        @for (m of data.members; track m.id; let i = $index) {
          <div class="row">
            <div class="member">
              <div class="avatar">{{ initials(m.firstName, m.lastName) }}</div>
              <div class="info">
                <div class="name">{{ m.firstName }} {{ m.lastName }}</div>
                <div class="email">{{ m.email }}</div>
              </div>
            </div>
            <div class="slider">
              <mat-slider
                [min]="0"
                [max]="maxFor(i)"
                [step]="1"
                discrete
                showTickMarks
              >
                <input matSliderThumb [value]="values[i]" (valueChange)="onChange(i, $event)" />
              </mat-slider>
              <div class="percent">{{ values[i] }}%</div>
            </div>
          </div>
        }
        <div class="total" [class.invalid]="sum() !== 100">
          Total: {{ sum() }}%
        </div>
      } @else {
        <div class="empty">No hay miembros para configurar.</div>
      }
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="close(false)">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="sum() !== 100 || saving" (click)="save()">
        {{ saving ? 'Guardando…' : 'Guardar' }}
      </button>
    </div>
  `,
  styles: [`
    .content { width: 560px; max-width: 100%; }
    .row { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 16px; padding: 8px 0; }
    .header { font-weight: 600; border-bottom: 1px solid var(--mat-sys-outline-variant); margin-bottom: 8px; }
    .member { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: #f0d7cd; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #6a4a3c; }
    .info { display: flex; flex-direction: column; }
    .info .name { font-weight: 600; }
    .info .email { font-size: 12px; color: var(--mat-sys-on-surface-variant); }
    .slider { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px; }
    .percent { width: 46px; text-align: right; }
    .total { margin-top: 8px; font-weight: 600; text-align: right; }
    .total.invalid { color: var(--mat-sys-error); }
    .empty { color: var(--mat-sys-on-surface-variant); }
  `]
})
export class PayRatioDialogComponent implements OnInit {
  values: number[] = [];
  saving = false;

  constructor(
    private dialogRef: MatDialogRef<PayRatioDialogComponent>,
    private houseService: HouseService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    // Initialize from existing payRatioPercentage if present, else from payRatio*100
    this.values = (this.data.members || []).map(m =>
      typeof m.payRatioPercentage === 'number' && m.payRatioPercentage > 0
        ? Math.round(m.payRatioPercentage)
        : Math.round((m.payRatio || 0) * 100)
    );

    // If all zeros, default to equal distribution
    if (!this.values.some(v => v > 0) && this.values.length) {
      const eq = Math.floor(100 / this.values.length);
      this.values = this.values.map(() => eq);
      // Distribute the remainder to the first items
      let remainder = 100 - eq * this.values.length;
      let i = 0;
      while (remainder-- > 0) this.values[i++ % this.values.length]++;
    }
  }

  initials(first?: string, last?: string): string {
    const f = (first || '').trim();
    const l = (last || '').trim();
    return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
  }

  sum(): number { return this.values.reduce((a, b) => a + b, 0); }

  maxFor(index: number): number {
    const others = this.sum() - this.values[index];
    return Math.max(0, 100 - others);
  }

  onChange(index: number, newVal: number) {
    // Clamp to dynamic max to strictly enforce sum <= 100
    const max = this.maxFor(index);
    this.values[index] = Math.min(Math.max(0, Math.round(newVal)), max);
  }

  save() {
    if (this.sum() !== 100 || this.saving) return;
    this.saving = true;
    const payload = this.data.members.map((m, i) => ({ roomieId: m.id, payRatio: this.values[i] / 100 }));
    this.houseService.updatePayRatios(this.data.houseId, payload).subscribe({
      next: () => this.close(true),
      error: () => { this.saving = false; },
    });
  }

  close(ok: boolean) { this.dialogRef.close(ok); }
}
