import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-new-transaction-dialog",
  standalone: true,
  imports: [MatFormField, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2>Nueva Transacción</h2>
    <form>
      <mat-form-field appearance="outline">
        <mat-label>Descripción</mat-label>
        <input matInput type="text" required>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Monto</mat-label>
        <input matInput type="number" required>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Tipo</mat-label>
        <mat-select required>

          <mat-option value="income">Ingreso</mat-option>
          <mat-option value="expense">Gasto</mat-option>
        </mat-select>
      </mat-form-field>
      <div class="actions">
        <button matButton="text" type="button">Cancelar</button>
        <button matButton="filled" color="primary" type="submit">Guardar</button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
      max-width: 400px;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 16px;
    }

    form {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `]
})
export class NewTransactionDialogComponent {
  constructor() { }
}
