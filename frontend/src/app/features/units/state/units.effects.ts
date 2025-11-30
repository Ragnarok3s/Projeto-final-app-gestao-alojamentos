import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
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
  updateUnitSuccess,
  deleteUnit,
  deleteUnitFailure,
  deleteUnitSuccess
} from './units.actions';

@Injectable()
export class UnitsEffects {
  loadUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUnits),
      mergeMap(() =>
        this.unitsService.getUnits().pipe(
          map((units) => loadUnitsSuccess({ units })),
          catchError(() => of(loadUnitsFailure({ error: 'Falha ao carregar unidades.' })))
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
          catchError((error: HttpErrorResponse) => of(createUnitFailure({ error: this.resolveSaveError(error) })))
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
          catchError((error: HttpErrorResponse) => of(updateUnitFailure({ error: this.resolveSaveError(error) })))
        )
      )
    )
  );

  deleteUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUnit),
      mergeMap(({ id }) =>
        this.unitsService.deleteUnit(id).pipe(
          map(() => deleteUnitSuccess({ id })),
          catchError(() => of(deleteUnitFailure({ error: 'Não foi possível eliminar a unidade.' })))
        )
      )
    )
  );

  constructor(private readonly actions$: Actions, private readonly unitsService: UnitsService) {}

  private resolveSaveError(_: HttpErrorResponse): string {
    return 'Não foi possível guardar a unidade.';
  }
}
