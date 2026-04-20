export type ProductCategory = 'print' | 'original' | 'digital' | 'service';

export interface ProductVariant {
  name: string;
  options: {
    value: string;
    priceModifier: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  images: string[];
  variants?: ProductVariant[];
  isDigital: boolean;
  digitalFileUrl?: string;
  inventory?: number;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
  price: number;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress?: Address;
  status: OrderStatus;
  stripePaymentId: string;
  createdAt: string;
  updatedAt: string;
}
