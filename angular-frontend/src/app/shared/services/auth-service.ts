import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthCredentials, AuthResponse, AuthenticatedUser } from '../interfaces/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8000/api'; 

  login(payload: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, payload);
  }

  // ESTE ES EL QUE TE FALTABA:
  register(payload: any): Observable<any> {
    return this.http.post<any>(`${this.API}/register`, payload);
  }

  me(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>(`${this.API}/me`);
  }
}