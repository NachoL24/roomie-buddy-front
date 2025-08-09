import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>{{ data.title || 'Confirmación' }}</h2>
    <div mat-dialog-content>
      <p>{{ data.message || '¿Estás seguro que deseas continuar?' }}</p>
    </div>
    <div mat-dialog-actions>
      <button matButton="text" (click)="onCancel()">{{ data.cancelText || 'Cancelar' }}</button>
      <button matButton="filled" class="confirm-button" (click)="onConfirm()">{{ data.confirmText || 'Confirmar' }}</button>
    </div>
  `,
  styles: [`
    .confirm-button {
      background-color: var(--mat-sys-error-container);
      color: white;
    }

    .confirm-button:hover {
      background-color: color-mix(in srgb, var(--mat-sys-error-container) 85%, white);
    }
  `]
})
export class ConfirmDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) { }

    onCancel() {
        this.dialogRef.close(false);
    }

    onConfirm() {
        this.dialogRef.close(true);
    }
}
