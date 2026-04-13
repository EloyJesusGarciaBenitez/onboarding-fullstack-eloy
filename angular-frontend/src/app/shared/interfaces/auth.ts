export interface AuthCredentials { email: string; password: string; }
export interface AuthResponse { token: string; }
export interface AuthenticatedUser { id: number; email: string; roles: string[]; }