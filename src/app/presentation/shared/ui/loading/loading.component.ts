import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-container">
      <div class="loading-content">
        <mat-spinner diameter="60"></mat-spinner>
        <h2>Cargando...</h2>
        <p>Estamos preparando tu experiencia</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--mat-sys-inverse-primary) 0%, var(--mat-sys-primary) 100%);
      opacity: 0.5;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-content {
      text-align: center;
      color: white;
      background: rgba(255, 255, 255, 0.1);
      padding: 2rem;
      border-radius: 16px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    h2 {
      margin: 1rem 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 300;
    }

    p {
      margin: 0;
      opacity: 0.8;
      font-size: 0.9rem;
    }

    mat-spinner {
      margin: 0 auto;
    }

    ::ng-deep .mat-mdc-progress-spinner circle {
      stroke: white;
    }
  `]
})
export class LoadingComponent { }
