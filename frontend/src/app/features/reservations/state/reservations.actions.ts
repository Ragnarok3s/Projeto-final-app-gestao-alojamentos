import { createAction, props } from '@ngrx/store';

import { Reservation } from '../models/reservation.model';
import { CreateReservationPayload } from '../models/reservation.model';

export const loadReservations = createAction(
  '[Reservations] Load Reservations',
  props<{ unitId: number; from?: string; to?: string }>()
);

export const loadReservationsSuccess = createAction(
  '[Reservations] Load Reservations Success',
  props<{ reservations: Reservation[] }>()
);

export const loadReservationsFailure = createAction(
  '[Reservations] Load Reservations Failure',
  props<{ error: string }>()
);

export const updateReservation = createAction(
  '[Reservations] Update Reservation',
  props<{ id: number; changes: Partial<Reservation> }>()
);

export const updateReservationSuccess = createAction(
  '[Reservations] Update Reservation Success',
  props<{ reservation: Reservation }>()
);

export const updateReservationFailure = createAction(
  '[Reservations] Update Reservation Failure',
  props<{ error: string }>()
);

export const createReservation = createAction(
  '[Reservations] Create Reservation',
  props<{ reservation: CreateReservationPayload }>()
);

export const createReservationSuccess = createAction(
  '[Reservations] Create Reservation Success',
  props<{ reservation: Reservation }>()
);

export const createReservationFailure = createAction(
  '[Reservations] Create Reservation Failure',
  props<{ error: string }>()
);

export const clearReservationsError = createAction('[Reservations] Clear Reservations Error');

export const cancelReservation = createAction(
  '[Reservations] Cancel Reservation',
  props<{ id: number }>()
);

export const cancelReservationSuccess = createAction(
  '[Reservations] Cancel Reservation Success',
  props<{ reservation: Reservation }>()
);

export const cancelReservationFailure = createAction(
  '[Reservations] Cancel Reservation Failure',
  props<{ error: string }>()
);
