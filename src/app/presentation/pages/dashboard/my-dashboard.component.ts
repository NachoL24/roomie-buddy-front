import { Component } from '@angular/core';
import { GlobalUserService } from '@application/use-cases';
import { MyResumeComponent } from "./components/my-resume.ng";
import { MyTransactionsComponent } from "./components/my-transactions.ng";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    MyResumeComponent,
    MyTransactionsComponent
  ],
  template: `
  <div class="header">
    <h1> Hola {{ userState.user()?.firstName }}! </h1>
    <p>Aquí puedes ver un resumen de tus finanzas</p>
  </div>
    <app-my-resume/>
    <app-my-transactions/>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      margin-top: 16px;
      gap: 16px;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    h1 {
      font-size: 42px;
      margin: 0;
    }
    p {
      font-size: 16px;
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
    }
  `]
})
export class MyDashboardComponent {

  constructor(public userState: GlobalUserService) { }
}
