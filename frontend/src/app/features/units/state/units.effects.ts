import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import { UnitsService } from '../services/units.service';
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

@Injectable()
export class UnitsEffects {
  loadUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUnits),
      mergeMap(() =>
        this.unitsService.getUnits().pipe(
          map((units) => loadUnitsSuccess({ units })),
          catchError((error) => of(loadUnitsFailure({ error })))
        )
      )
    )
  );

  createUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createUnit),
      mergeMap(({ payload }) =>
        this.unitsService.createUnit(payload).pipe(
          map((unit) => createUnitSuccess({ unit })),
          catchError((error) => of(createUnitFailure({ error })))
        )
      )
    )
  );

  updateUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUnit),
      mergeMap(({ id, changes }) =>
        this.unitsService.updateUnit(id, changes).pipe(
          map((unit) => updateUnitSuccess({ unit })),
          catchError((error) => of(updateUnitFailure({ error })))
        )
      )
    )
  );

  constructor(private readonly actions$: Actions, private readonly unitsService: UnitsService) {}
}
