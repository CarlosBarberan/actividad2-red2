import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product, Invoice } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private readonly TAX_RATE = 0.21; // 21% IVA

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.product.price * existingItem.quantity;
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        subtotal: product.price * quantity
      };
      currentItems.push(newItem);
    }

    this.cartItems.next([...currentItems]);
    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.value;
    const filteredItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.next(filteredItems);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.id === productId);
    
    if (item) {
      item.quantity = quantity;
      item.subtotal = item.product.price * quantity;
      this.cartItems.next([...currentItems]);
      this.saveCartToStorage();
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartItemCount(): Observable<number> {
    return new Observable(observer => {
      this.cartItems.subscribe(items => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  getSubtotal(): Observable<number> {
    return new Observable(observer => {
      this.cartItems.subscribe(items => {
        const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
        observer.next(subtotal);
      });
    });
  }

  getTax(): Observable<number> {
    return new Observable(observer => {
      this.getSubtotal().subscribe(subtotal => {
        const tax = subtotal * this.TAX_RATE;
        observer.next(tax);
      });
    });
  }

  getTotal(): Observable<number> {
    return new Observable(observer => {
      this.getSubtotal().subscribe(subtotal => {
        this.getTax().subscribe(tax => {
          const total = subtotal + tax;
          observer.next(total);
        });
      });
    });
  }

  generateInvoice(): Invoice {
    const items = this.cartItems.value;
    const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
    const tax = subtotal * this.TAX_RATE;
    const total = subtotal + tax;

    return {
      items: [...items],
      subtotal,
      tax,
      total,
      date: new Date()
    };
  }

  private saveCartToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
    }
  }

  private loadCartFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          const cartItems = JSON.parse(storedCart);
          this.cartItems.next(cartItems);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }
}
