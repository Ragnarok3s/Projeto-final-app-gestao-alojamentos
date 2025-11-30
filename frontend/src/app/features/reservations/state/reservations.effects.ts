import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

import { ReservationsService } from '../services/reservations.service';
import {
  cancelReservation,
  cancelReservationFailure,
  cancelReservationSuccess,
  createReservation,
  createReservationFailure,
  createReservationSuccess,
  loadReservations,
  loadReservationsFailure,
  loadReservationsSuccess,
  loadReservationsList,
  loadReservationsListFailure,
  loadReservationsListSuccess,
  updateReservation,
  updateReservationFailure,
  updateReservationSuccess
} from './reservations.actions';
import { ReservationDialogService } from '../services/reservation-dialog.service';

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

  loadReservationsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReservationsList),
      mergeMap(({ filters }) =>
        this.reservationsService.getReservationsList(filters).pipe(
          map((reservations) => loadReservationsListSuccess({ reservations })),
          catchError((error) => of(loadReservationsListFailure({ error })))
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

  createReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReservation),
      mergeMap(({ reservation }) =>
        this.reservationsService.createReservation(reservation.unitId, reservation).pipe(
          map((created) => createReservationSuccess({ reservation: created })),
          catchError((error: HttpErrorResponse) => of(createReservationFailure({ error: this.resolveSaveError(error) })))
        )
      )
    )
  );

  closeDialogOnCreateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createReservationSuccess),
        tap(() => this.dialogService.requestCloseCreateDialog())
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly reservationsService: ReservationsService,
    private readonly dialogService: ReservationDialogService
  ) {}

  private resolveSaveError(error: HttpErrorResponse): string {
    const serverMessage = (error.error as { message?: string } | undefined)?.message;
    if (serverMessage) {
      return serverMessage;
    }
    if (error.status === 409) {
      return 'Já existe reserva nessas datas para esta unidade.';
    }
    return 'Não foi possível guardar a reserva. Tente novamente.';
  }

  private resolveCancelError(_: HttpErrorResponse): string {
    return 'Não foi possível cancelar a reserva. Tente novamente.';
  }
}
