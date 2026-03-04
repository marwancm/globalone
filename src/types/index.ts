export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  images?: string[];
  stock: number;
  category_id: string;
  created_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Locale = 'ar' | 'en';
export type Theme = 'light' | 'dark';
