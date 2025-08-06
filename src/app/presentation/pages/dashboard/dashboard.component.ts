import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { AuthenticationService, GlobalUserService } from '@application/use-cases';
import { User } from '@domain/entities';
import { ToolbarComponent } from '@presentation/shared/ui/toolbar/toolbar.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    ToolbarComponent
  ],
  template: `
    <app-toolbar/>
    <mat-card>
      <mat-card-header>
        <mat-card-title>Welcome to the Homepage</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>This is the content of the homepage.</p>
        @if (userState.isLoggedIn()) {
          <p>Welcome back, {{ userState.user()?.firstName }}!</p>
        }
      </mat-card-content>
    </mat-card>
  `
})
export class DashboardComponent {

  constructor(public userState: GlobalUserService) {}
}
