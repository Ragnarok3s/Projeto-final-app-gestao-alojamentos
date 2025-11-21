import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

import { login } from '../../state/auth.actions';
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../../state/auth.selectors';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  loading$: Observable<boolean> = this.store.select(selectAuthLoading);
  error$: Observable<string | null> = this.store.select(selectAuthError);

  constructor(private readonly fb: FormBuilder, private readonly store: Store, private readonly router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.store
      .select(selectIsAuthenticated)
      .pipe(take(1))
      .subscribe((isAuth) => {
        if (isAuth) {
          this.router.navigate(['/app/units']);
        }
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    this.store.dispatch(login({ email, password }));
  }

  get emailControl() {
    return this.form.get('email');
  }

  get passwordControl() {
    return this.form.get('password');
  }
}
