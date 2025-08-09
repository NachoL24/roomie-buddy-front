import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InvitationService } from '@application/use-cases';

interface DialogData { houseId: number; }

@Component({
    selector: 'app-invite-member-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>Invite Member</h2>
    <div mat-dialog-content class="form">
      <mat-form-field appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="email">
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">Cancel</button>
      <button mat-flat-button color="primary" (click)="invite()" [disabled]="!valid()">Send</button>
    </div>
  `,
    styles: [`.form { display: flex; flex-direction: column; gap: 12px; width: 360px; }`]
})
export class InviteMemberDialogComponent {
    private dialogRef = inject(MatDialogRef<InviteMemberDialogComponent>);
    private invitationService = inject(InvitationService);

    email = '';

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    valid() { return /.+@.+\..+/.test(this.email); }

    invite() {
        this.invitationService.inviteUserToHouse(this.email, this.data.houseId).subscribe(() => this.close(true));
    }

    close(ok: boolean) { this.dialogRef.close(ok); }
}
