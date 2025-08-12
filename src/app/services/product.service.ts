import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop Gaming',
      description: 'Laptop de alto rendimiento para gaming',
      price: 1299.99,
      stock: 15,
      category: 'Electrónicos',
      imageUrl: 'https://via.placeholder.com/300x200?text=Laptop+Gaming'
    },
    {
      id: 2,
      name: 'Smartphone Pro',
      description: 'Smartphone de última generación',
      price: 899.99,
      stock: 25,
      category: 'Electrónicos',
      imageUrl: 'https://via.placeholder.com/300x200?text=Smartphone+Pro'
    },
    {
      id: 3,
      name: 'Auriculares Wireless',
      description: 'Auriculares bluetooth con cancelación de ruido',
      price: 199.99,
      stock: 30,
      category: 'Accesorios',
      imageUrl: 'https://via.placeholder.com/300x200?text=Auriculares+Wireless'
    },
    {
      id: 4,
      name: 'Tablet Ultra',
      description: 'Tablet de 10 pulgadas con pantalla retina',
      price: 599.99,
      stock: 20,
      category: 'Electrónicos',
      imageUrl: 'https://via.placeholder.com/300x200?text=Tablet+Ultra'
    },
    {
      id: 5,
      name: 'Cámara DSLR',
      description: 'Cámara réflex digital profesional',
      price: 1499.99,
      stock: 10,
      category: 'Fotografía',
      imageUrl: 'https://via.placeholder.com/300x200?text=Cámara+DSLR'
    },
    {
      id: 6,
      name: 'Teclado Mecánico',
      description: 'Teclado gaming con switches mecánicos',
      price: 149.99,
      stock: 35,
      category: 'Accesorios',
      imageUrl: 'https://via.placeholder.com/300x200?text=Teclado+Mecánico'
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return of(this.products.filter(p => p.category === category));
  }

  updateStock(productId: number, quantity: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product && product.stock >= quantity) {
      product.stock -= quantity;
    }
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.products.map(p => p.category))];
    return of(categories);
  }
}
