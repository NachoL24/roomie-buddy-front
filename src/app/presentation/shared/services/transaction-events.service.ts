import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionEventsService {
  private transactionCreatedSubject = new Subject<void>();

  // Observable que otros componentes pueden suscribirse para escuchar cuando se crea una transacción
  transactionCreated$ = this.transactionCreatedSubject.asObservable();

  // Método para emitir el evento cuando se crea una nueva transacción
  emitTransactionCreated(): void {
    this.transactionCreatedSubject.next();
  }
}
