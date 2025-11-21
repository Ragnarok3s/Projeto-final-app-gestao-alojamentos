import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UnitsState, selectAll, selectEntities } from './units.reducer';

export const selectUnitsState = createFeatureSelector<UnitsState>('units');

export const selectUnitsLoading = createSelector(selectUnitsState, (state) => state.loading);
export const selectUnitsError = createSelector(selectUnitsState, (state) => state.error);
export const selectAllUnits = createSelector(selectUnitsState, selectAll);
export const selectUnitEntities = createSelector(selectUnitsState, selectEntities);
