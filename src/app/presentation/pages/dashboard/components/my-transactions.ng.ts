import { Component } from "@angular/core";

@Component({
  selector: "app-my-transactions",
  standalone: true,
  imports: [],
  template: `
    <h1 class="title">Ultimas Transacciones</h1>
  `,
  styles: [`
    .title {
      font-size: 24px;
      margin-top: 6px;
    }
  `]
})
export class MyTransactionsComponent {
  
}
