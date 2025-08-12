export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Invoice {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: Date;
}
