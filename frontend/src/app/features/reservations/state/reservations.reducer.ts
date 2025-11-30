import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Reservation } from '../models/reservation.model';
import { ReservationsListFilters } from '../services/reservations.service';
import {
  cancelReservation,
  cancelReservationFailure,
  cancelReservationSuccess,
  clearReservationsError,
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

export interface ReservationsState extends EntityState<Reservation> {
  loading: boolean;
  error: string | null;
  list: Reservation[];
  listLoading: boolean;
  listError: any;
  listFilters: ReservationsListFilters;
}

export const reservationsAdapter: EntityAdapter<Reservation> = createEntityAdapter<Reservation>();

function updateListWithReservation(list: Reservation[], reservation: Reservation): Reservation[] {
  return list.some((item) => item.id === reservation.id)
    ? list.map((item) => (item.id === reservation.id ? reservation : item))
    : list;
}

export const initialState: ReservationsState = reservationsAdapter.getInitialState({
  loading: false,
  error: null,
  list: [],
  listLoading: false,
  listError: null,
  listFilters: {}
});

export const reservationsReducer = createReducer(
  initialState,
  on(loadReservations, (state) => ({ ...state, loading: true, error: null })),
  on(loadReservationsSuccess, (state, { reservations }) =>
    reservationsAdapter.setAll(reservations, { ...state, loading: false, error: null })
  ),
  on(loadReservationsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(loadReservationsList, (state, { filters }) => ({
    ...state,
    listLoading: true,
    listError: null,
    listFilters: filters
  })),
  on(loadReservationsListSuccess, (state, { reservations }) => ({
    ...state,
    listLoading: false,
    list: reservations
  })),
  on(loadReservationsListFailure, (state, { error }) => ({
    ...state,
    listLoading: false,
    listError: error
  })),
  on(updateReservation, (state) => ({ ...state, loading: true, error: null })),
  on(updateReservationSuccess, (state, { reservation }) =>
    reservationsAdapter.upsertOne(reservation, {
      ...state,
      loading: false,
      error: null,
      list: updateListWithReservation(state.list, reservation)
    })
  ),
  on(updateReservationFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(cancelReservation, (state) => ({ ...state, loading: true, error: null })),
  on(cancelReservationSuccess, (state, { reservation }) =>
    reservationsAdapter.upsertOne(reservation, {
      ...state,
      loading: false,
      error: null,
      list: updateListWithReservation(state.list, reservation)
    })
  ),
  on(cancelReservationFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(createReservation, (state) => ({ ...state, loading: true, error: null })),
  on(createReservationSuccess, (state, { reservation }) =>
    reservationsAdapter.upsertOne(reservation, { ...state, loading: false, error: null })
  ),
  on(createReservationFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(clearReservationsError, (state) => ({ ...state, error: null }))
);

export const { selectAll: selectAllReservationEntities, selectEntities: selectReservationEntities } =
  reservationsAdapter.getSelectors();
