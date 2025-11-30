import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservationDialogService {
  private readonly closeCreateDialogSubject = new Subject<void>();

  closeCreateDialog$ = this.closeCreateDialogSubject.asObservable();

  requestCloseCreateDialog(): void {
    this.closeCreateDialogSubject.next();
  }
}
