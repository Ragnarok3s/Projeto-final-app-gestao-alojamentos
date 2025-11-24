import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { logout } from '../features/auth/state/auth.actions';
import { selectAuthUser } from '../features/auth/state/auth.selectors';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  user$ = this.store.select(selectAuthUser);

  constructor(private readonly store: Store) {}

  signOut(): void {
    this.store.dispatch(logout());
  }
}
