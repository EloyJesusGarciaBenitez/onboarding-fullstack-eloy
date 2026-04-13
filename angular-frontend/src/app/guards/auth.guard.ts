import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../shared/services/auth-store';

export const authGuard = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  // Si está logueado, pasa. Si no, al login.
  return store.isLoggedIn() ? true : router.parseUrl('/login');
};
