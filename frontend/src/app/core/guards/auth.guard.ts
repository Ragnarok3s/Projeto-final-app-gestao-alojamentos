import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take, tap } from 'rxjs';

import { selectIsAuthenticated } from '../../features/auth/state/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectIsAuthenticated).pipe(
      take(1),
      map((isAuth) => isAuth || !!localStorage.getItem('auth_token')),
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      }),
      map((isAuth) => isAuth)
    );
  }
}
