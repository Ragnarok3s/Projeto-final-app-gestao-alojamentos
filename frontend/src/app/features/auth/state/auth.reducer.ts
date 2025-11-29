import { createReducer, on } from '@ngrx/store';

import { User } from '../models/user.model';
import { login, loginFailure, loginSuccess, logout, register, registerFailure, registerSuccess } from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
const storedUser =
  typeof localStorage !== 'undefined' && localStorage.getItem('auth_user')
    ? JSON.parse(localStorage.getItem('auth_user') as string)
    : null;

export const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { token, user }) => ({ ...state, token, user, loading: false, error: null })),
  on(loginFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(register, (state) => ({ ...state, loading: true, error: null })),
  on(registerSuccess, (state, { token, user }) => ({ ...state, token, user, loading: false, error: null })),
  on(registerFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(logout, () => ({ user: null, token: null, loading: false, error: null }))
);
