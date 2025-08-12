import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem, Invoice } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  showInvoiceModal: boolean = false;
  currentInvoice: Invoice | null = null;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartData();
  }

  loadCartData(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.getSubtotal().subscribe(subtotal => {
      this.subtotal = subtotal;
    });

    this.cartService.getTax().subscribe(tax => {
      this.tax = tax;
    });

    this.cartService.getTotal().subscribe(total => {
      this.total = total;
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  generateInvoice(): void {
    this.currentInvoice = this.cartService.generateInvoice();
    this.showInvoiceModal = true;
  }

  closeInvoiceModal(): void {
    this.showInvoiceModal = false;
    this.currentInvoice = null;
  }

  generateInvoiceNumber(): string {
    return 'INV-' + Date.now().toString().slice(-6);
  }
}
