import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Reservation } from '../models/reservation.model';
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

export interface ReservationsState extends EntityState<Reservation> {
  loading: boolean;
  error: string | null;
}

export const reservationsAdapter: EntityAdapter<Reservation> = createEntityAdapter<Reservation>();

export const initialState: ReservationsState = reservationsAdapter.getInitialState({
  loading: false,
  error: null
});

export const reservationsReducer = createReducer(
  initialState,
  on(loadReservations, (state) => ({ ...state, loading: true, error: null })),
  on(loadReservationsSuccess, (state, { reservations }) =>
    reservationsAdapter.setAll(reservations, { ...state, loading: false, error: null })
  ),
  on(loadReservationsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(updateReservation, (state) => ({ ...state, loading: true, error: null })),
  on(updateReservationSuccess, (state, { reservation }) =>
    reservationsAdapter.upsertOne(reservation, { ...state, loading: false, error: null })
  ),
  on(updateReservationFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(cancelReservation, (state) => ({ ...state, loading: true, error: null })),
  on(cancelReservationSuccess, (state, { reservation }) =>
    reservationsAdapter.upsertOne(reservation, { ...state, loading: false, error: null })
  ),
  on(cancelReservationFailure, (state, { error }) => ({ ...state, loading: false, error }))
);

export const { selectAll: selectAllReservations, selectEntities: selectReservationEntities } = reservationsAdapter.getSelectors();
