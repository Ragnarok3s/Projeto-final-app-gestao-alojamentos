import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Unit } from '../models/unit.model';
import {
  createUnit,
  createUnitFailure,
  createUnitSuccess,
  loadUnits,
  loadUnitsFailure,
  loadUnitsSuccess,
  updateUnit,
  updateUnitFailure,
  updateUnitSuccess
} from './units.actions';

export interface UnitsState extends EntityState<Unit> {
  loading: boolean;
  error: string | null;
}

export const unitsAdapter = createEntityAdapter<Unit>({
  selectId: (unit) => unit.id
});

export const initialState: UnitsState = unitsAdapter.getInitialState({
  loading: false,
  error: null
});

export const unitsReducer = createReducer(
  initialState,
  on(loadUnits, (state) => ({ ...state, loading: true, error: null })),
  on(loadUnitsSuccess, (state, { units }) => unitsAdapter.setAll(units, { ...state, loading: false })),
  on(loadUnitsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(createUnit, (state) => ({ ...state, loading: true, error: null })),
  on(createUnitSuccess, (state, { unit }) => unitsAdapter.addOne(unit, { ...state, loading: false })),
  on(createUnitFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(updateUnit, (state) => ({ ...state, loading: true, error: null })),
  on(updateUnitSuccess, (state, { unit }) => unitsAdapter.upsertOne(unit, { ...state, loading: false })),
  on(updateUnitFailure, (state, { error }) => ({ ...state, loading: false, error }))
);

export const { selectAll, selectEntities } = unitsAdapter.getSelectors();
