import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { GlobalUserService, UserService } from '@application/use-cases';
import { User } from '@domain/entities';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    NgOptimizedImage,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <h1 class="title">Mi perfil</h1>
      <div class="user-pic">
        <div class="avatar">
              @if (userPic(); as pic) {
                <img [ngSrc]="pic" alt="Avatar" height="100" width="100" priority="true" />
              }
        </div>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <div class="grid">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="firstName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="lastName" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email"/>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full" >
            <mat-label>Documento</mat-label>
            <input matInput formControlName="doc" required />
          </mat-form-field>
        </div>

        <div class="actions">
          <button mat-button type="button" (click)="goBack()" [disabled]="saving() || !user()?.profileCompleted">Cancelar</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .title {
      margin: 0;
    }
    .user-pic {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
    .container {
      max-width: 800px;
      margin: 24px auto;
      padding: 0 16px;
    }
    .form {
      display: flex;
      flex-direction: column;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 16px;
    }
    .grid .full {
      grid-column: 1 / -1;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .meta {
      display: flex;
      gap: 16px;
      padding: 16px;
      color: var(--mat-sys-on-surface-variant);
    }
    .avatar img {
      border-radius: 50%;
      object-fit: cover;
    }
    @media (max-width: 600px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserProfilePageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  userState = inject(GlobalUserService);
  private userService = inject(UserService);
  private snack = inject(MatSnackBar);

  saving = signal(false);

  user = computed<User | null>(() => this.userState.user());
  userPic = computed(() => this.user()?.pic);

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    doc: ['']
  });

  constructor() {
    const u = this.user();

    // Mantener el formulario sincronizado cuando el usuario cargue o cambie
    effect(() => {
      const user = this.user();
      if (!user) return;
      this.form.patchValue({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        doc: user.doc ?? ''
      }, { emitEvent: false });
      if (user.email && user.email.trim() !== '') {
        this.form.controls.email.disable({ emitEvent: false });
      } else {
        this.form.controls.email.enable({ emitEvent: false });
      }
      if (user.firstName && user.firstName.trim() !== '') {
        this.form.controls.firstName.disable({ emitEvent: false });
      } else {
        this.form.controls.firstName.enable({ emitEvent: false });
      }
      if (user.lastName && user.lastName.trim() !== '') {
        this.form.controls.lastName.disable({ emitEvent: false });
      } else {
        this.form.controls.lastName.enable({ emitEvent: false });
      }
      if (user.doc && user.doc.trim() !== '') {
        this.form.controls.doc.disable({ emitEvent: false });
      } else {
        this.form.controls.doc.enable({ emitEvent: false });
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  onSubmit() {
    if (!this.user() || this.form.invalid || this.saving()) return;
    const u = this.user()!;
    const payload = {
      firstName: this.form.value.firstName ?? '',
      lastName: this.form.value.lastName ?? '',
      doc: this.form.value.doc ?? ''
    } satisfies Partial<User>;

    this.saving.set(true);
    this.userService.updateUserProfile(u.id, payload).subscribe({
      next: (updated) => {
        // Actualiza el estado global con el usuario actualizado
        if (updated) this.userState.setUser(updated);
      },
      error: (_) => {
        this.saving.set(false);
        this.snack.open('Error al editar el perfil, intentelo mas tarde', 'Cerrar');
      },
      complete: () => {
        this.saving.set(false);
        this.snack.open('Perfil actualizado con éxito', 'Cerrar');
      }
    });
  }

  emailDisabled() {
    return this.form.controls.email.disabled;
  }
}
