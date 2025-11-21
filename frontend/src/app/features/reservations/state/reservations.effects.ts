import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import { ReservationsService } from '../services/reservations.service';
import {
  cancelReservation,
  cancelReservationFailure,
  cancelReservationSuccess,
  loadReservations,
  loadReservationsFailure,
  loadReservationsSuccess,
  updateReservation,
  updateReservationFailure,
  updateReservationSuccess
} from './reservations.actions';

@Injectable()
export class ReservationsEffects {
  loadReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReservations),
      mergeMap(({ unitId, from, to }) =>
        this.reservationsService.getReservations(unitId, from, to).pipe(
          map((reservations) => loadReservationsSuccess({ reservations })),
          catchError(() => of(loadReservationsFailure({ error: 'Falha ao carregar reservas.' })))
        )
      )
    )
  );

  updateReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateReservation),
      mergeMap(({ id, changes }) =>
        this.reservationsService.updateReservation(id, changes).pipe(
          map((reservation) => updateReservationSuccess({ reservation })),
          catchError((error: HttpErrorResponse) => of(updateReservationFailure({ error: this.resolveSaveError(error) })))
        )
      )
    )
  );

  cancelReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelReservation),
      mergeMap(({ id }) =>
        this.reservationsService.cancelReservation(id).pipe(
          map((reservation) => cancelReservationSuccess({ reservation })),
          catchError((error: HttpErrorResponse) => of(cancelReservationFailure({ error: this.resolveCancelError(error) })))
        )
      )
    )
  );

  constructor(private readonly actions$: Actions, private readonly reservationsService: ReservationsService) {}

  private resolveSaveError(error: HttpErrorResponse): string {
    if (error.status === 409) {
      return 'Já existe reserva nessas datas para esta unidade.';
    }
    return 'Não foi possível guardar a reserva. Tente novamente.';
  }

  private resolveCancelError(_: HttpErrorResponse): string {
    return 'Não foi possível cancelar a reserva. Tente novamente.';
  }
}
