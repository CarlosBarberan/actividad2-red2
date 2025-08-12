import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  newProduct: Partial<Product> = {};
  newUser: Partial<User> = {};
  UserRole = UserRole;

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initializeNewProduct();
    this.initializeNewUser();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  initializeNewProduct(): void {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      imageUrl: 'https://via.placeholder.com/300x200'
    };
  }

  initializeNewUser(): void {
    this.newUser = {
      username: '',
      email: '',
      role: UserRole.CUSTOMER
    };
  }

  isValidProduct(): boolean {
    return !!(this.newProduct.name && this.newProduct.price && this.newProduct.stock);
  }

  isValidUser(): boolean {
    return !!(this.newUser.username && this.newUser.email);
  }

  addProduct(): void {
    if (this.isValidProduct()) {
      const product: Product = {
        id: Date.now(),
        name: this.newProduct.name!,
        description: this.newProduct.description!,
        price: this.newProduct.price!,
        stock: this.newProduct.stock!,
        category: this.newProduct.category!,
        imageUrl: this.newProduct.imageUrl!
      };
      
      // En un sistema real, esto se haría a través de un servicio
      this.products.push(product);
      this.initializeNewProduct();
    }
  }

  addUser(): void {
    if (this.isValidUser()) {
      // En un sistema real, esto se haría a través de un servicio
      console.log('Usuario agregado:', this.newUser);
      this.initializeNewUser();
    }
  }

  editProduct(product: Product): void {
    // Implementar edición de productos
    console.log('Editar producto:', product);
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.products = this.products.filter(p => p.id !== productId);
    }
  }

  getTotalStock(): number {
    return this.products.reduce((total, product) => total + product.stock, 0);
  }

  getTotalValue(): number {
    return this.products.reduce((total, product) => total + (product.price * product.stock), 0);
  }

  getLowStockCount(): number {
    return this.products.filter(product => product.stock < 5).length;
  }
}
