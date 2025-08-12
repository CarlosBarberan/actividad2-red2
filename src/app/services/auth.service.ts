import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false
  });

  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@tienda.com',
      role: UserRole.ADMIN,
      isAuthenticated: false
    },
    {
      id: 2,
      username: 'user',
      email: 'user@tienda.com',
      role: UserRole.CUSTOMER,
      isAuthenticated: false
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.checkStoredAuth();
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username);
    if (user && password === '123') { // Contraseña por defecto para usuarios registrados
      const authUser = { ...user, isAuthenticated: true };
      this.authState.next({
        user: authUser,
        isAuthenticated: true
      });
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('authUser', JSON.stringify(authUser));
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this.authState.next({
      user: null,
      isAuthenticated: false
    });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authUser');
    }
  }

  getAuthState(): Observable<AuthState> {
    return this.authState.asObservable();
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  registerUser(username: string, email: string, role: UserRole): boolean {
    const existingUser = this.users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return false; // Usuario ya existe
    }

    const newUser: User = {
      id: Date.now(),
      username,
      email,
      role,
      isAuthenticated: false
    };

    this.users.push(newUser);
    return true;
  }

  private checkStoredAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.authState.next({
            user,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }
    }
  }
}
