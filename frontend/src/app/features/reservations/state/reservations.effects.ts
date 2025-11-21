import { Injectable } from '@angular/core';
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
          catchError((error) => of(loadReservationsFailure({ error: error.message ?? 'Erro ao carregar reservas' })))
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
          catchError((error) => of(updateReservationFailure({ error: error.message ?? 'Erro ao atualizar reserva' })))
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
          catchError((error) => of(cancelReservationFailure({ error: error.message ?? 'Erro ao cancelar reserva' })))
        )
      )
    )
  );

  constructor(private readonly actions$: Actions, private readonly reservationsService: ReservationsService) {}
}
