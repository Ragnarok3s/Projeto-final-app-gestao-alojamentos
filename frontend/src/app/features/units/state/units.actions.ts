import { createAction, props } from '@ngrx/store';

import { Unit } from '../models/unit.model';

export const loadUnits = createAction('[Units] Load Units');
export const loadUnitsSuccess = createAction('[Units] Load Units Success', props<{ units: Unit[] }>());
export const loadUnitsFailure = createAction('[Units] Load Units Failure', props<{ error: any }>());

export const createUnit = createAction('[Units] Create Unit', props<{ payload: Partial<Unit> }>());
export const createUnitSuccess = createAction('[Units] Create Unit Success', props<{ unit: Unit }>());
export const createUnitFailure = createAction('[Units] Create Unit Failure', props<{ error: any }>());

export const updateUnit = createAction('[Units] Update Unit', props<{ id: number; changes: Partial<Unit> }>());
export const updateUnitSuccess = createAction('[Units] Update Unit Success', props<{ unit: Unit }>());
export const updateUnitFailure = createAction('[Units] Update Unit Failure', props<{ error: any }>());
