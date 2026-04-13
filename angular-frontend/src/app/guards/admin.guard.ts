import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../shared/services/auth-store';

export const adminGuard = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  // Si es admin, pasa. Si no, le mandamos a sus tareas normales.
  return store.isAdmin() ? true : router.parseUrl('/tasks');
};