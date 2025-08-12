import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  currentUser: User | null = null;
  cartItemCount: number = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(authState => {
      this.isAuthenticated = authState.isAuthenticated;
      this.currentUser = authState.user;
    });

    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('admin' as any);
  }

  getRoleDisplayName(role: string | undefined): string {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'customer': return 'Cliente';
      default: return 'Invitado';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
