import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { login, loginFailure, loginSuccess, logout, register, registerFailure, registerSuccess } from './auth.actions';

@Injectable()
export class AuthEffects {
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      mergeMap(({ email, password }) =>
        this.authService.register(email, password).pipe(
          map((response) => registerSuccess({ token: response.token, user: response.user })),
          catchError((error) => {
            const message = error?.status === 400 ? 'Utilizador já existe.' : 'Falha ao registar. Tente novamente mais tarde.';
            return of(registerFailure({ error: message }));
          })
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerSuccess),
        tap(({ token, user }) => {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
          this.router.navigate(['/app/units']);
        })
      ),
    { dispatch: false }
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response) => loginSuccess({ token: response.token, user: response.user })),
          catchError((error) => {
            const status = error?.status;
            const message = status === 401 ? 'Email ou palavra-passe inválidos.' : 'Falha ao iniciar sessão. Tente novamente mais tarde.';
            return of(loginFailure({ error: message }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ token, user }) => {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
          this.router.navigate(['/app/units']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  constructor(private readonly actions$: Actions, private readonly authService: AuthService, private readonly router: Router) {}
}
