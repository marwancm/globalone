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
  discount_start_date: string | null;
  discount_end_date: string | null;
  stock: number;
  image_url: string | null;
  images: string[];
  category_id: string;
  brand?: string;
  created_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  image_url: string | null;
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

export interface HeroSlide {
  id: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  image_url: string;
  link: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface Brand {
  id: string;
  name_ar: string;
  name_en: string;
  logo_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export type Locale = 'ar' | 'en';
export type Theme = 'light' | 'dark';
