import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-house-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInputModule, MatButtonModule, MatDialogModule],
  template: `
  <mat-dialog-content>
    <h2>Crear Casa</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Nombre de la casa</mat-label>
        <input matInput formControlName="name" required maxlength="100" />
        @if (form.get('name')?.invalid && form.get('name')?.touched) {
          <mat-error>
            @if (form.get('name')?.errors?.['required']) {
              El nombre es requerido
            } @else if (form.get('name')?.errors?.['minlength']) {
              Debe tener al menos 3 caracteres
            }
          </mat-error>
        }
      </mat-form-field>

      <div style="display:flex; justify-content:flex-end; gap:12px; margin-top: 8px;">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Crear</button>
      </div>
    </form>
  </mat-dialog-content>
  `,
  styles: [`

  `]
})
export class CreateHouseDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateHouseDialogComponent>);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  onSubmit() {
    if (this.form.valid) {
      const name = (this.form.value.name ?? '').toString().trim();
      this.dialogRef.close(name);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
