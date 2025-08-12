import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanMatch {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    const requiredRole = route.data?.['role'] as UserRole;
    
    if (!requiredRole) {
      return true;
    }

    if (this.authService.hasRole(requiredRole)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
