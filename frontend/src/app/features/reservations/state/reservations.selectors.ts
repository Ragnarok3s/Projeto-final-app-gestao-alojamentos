import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  ReservationsState,
  selectAllReservationEntities,
  selectReservationEntities
} from './reservations.reducer';

export const selectReservationsState = createFeatureSelector<ReservationsState>('reservations');

export const selectReservationsLoading = createSelector(selectReservationsState, (state) => state.loading);

export const selectReservationsError = createSelector(selectReservationsState, (state) => state.error);

export const selectReservationEntitiesList = createSelector(
  selectReservationsState,
  selectAllReservationEntities
);

export const selectReservationsByUnit = (unitId: number) =>
  createSelector(selectReservationEntitiesList, (reservations) => reservations.filter((r) => r.unitId === unitId));

export const selectReservationsList = createSelector(selectReservationsState, (state) => state.list);

export const selectReservationsListLoading = createSelector(selectReservationsState, (state) => state.listLoading);

export const selectReservationsListFilters = createSelector(selectReservationsState, (state) => state.listFilters);

export const selectReservationEntitiesMap = createSelector(selectReservationsState, selectReservationEntities);
