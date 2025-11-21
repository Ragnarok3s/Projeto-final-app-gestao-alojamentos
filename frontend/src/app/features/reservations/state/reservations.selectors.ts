import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ReservationsState, selectAllReservations } from './reservations.reducer';

export const selectReservationsState = createFeatureSelector<ReservationsState>('reservations');

export const selectReservationsLoading = createSelector(selectReservationsState, (state) => state.loading);

export const selectReservationsError = createSelector(selectReservationsState, (state) => state.error);

export const selectReservationsList = createSelector(selectReservationsState, selectAllReservations);

export const selectReservationsByUnit = (unitId: number) =>
  createSelector(selectReservationsList, (reservations) => reservations.filter((r) => r.unitId === unitId));
