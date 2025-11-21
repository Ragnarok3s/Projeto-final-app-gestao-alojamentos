import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(): boolean {
    // Placeholder: integrate with real auth state when available
    // For now, always allow navigation; replace with auth check later.
    return true;
  }
}
