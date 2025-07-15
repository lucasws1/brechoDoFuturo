import { Request } from "express";

// Tipos de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  type: "Customer" | "Admin";
  phone?: string;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// Tipos de produto
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  status: "Available" | "Sold" | "Hidden";
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de pedido
export interface Order {
  id: string;
  customerId: string;
  totalPrice: number;
  status: "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  deliveryAddress: Address;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

// Tipos de carrinho
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

// Tipos de autenticação
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: Address;
}

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para filtros e paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductFilters extends PaginationParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  search?: string;
}

export interface OrderFilters extends PaginationParams {
  status?: string;
  customerId?: string;
  startDate?: Date;
  endDate?: Date;
}
