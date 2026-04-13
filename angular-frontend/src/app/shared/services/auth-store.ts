import { Injectable, computed, signal, inject } from '@angular/core';
import { AuthenticatedUser } from '../interfaces/auth';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private authApi = inject(AuthService);
  
  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly user = signal<AuthenticatedUser | null>(null);

  readonly isLoggedIn = computed(() => !!this.token());
  readonly isAdmin = computed(() => this.user()?.roles?.includes('ROLE_ADMIN') ?? false);

  setSession(token: string) {
    this.token.set(token);
    localStorage.setItem('token', token);
  }

  clearSession() {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem('token');
  }

  loadMe() {
    return this.authApi.me().subscribe({
      next: (u: AuthenticatedUser) => {
        this.user.set(u);
      },
      error: () => this.clearSession()
    });
  }
}