import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';

@Injectable()
export class AuthEffects {
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
