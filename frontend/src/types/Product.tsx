import type { Category } from "./Category";

export interface Product {
  id: string;
  name: string;
  price: number;
  // image?: string; // Campo opcional para compatibilidade
  images?: string[]; // Array de imagens do backend
  description: string;
  stock?: number;
  status?: string; // Status do produto
  // sellerId?: string; // ID do vendedor
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  categoryId?: string; // IDs das categorias
  category?: Category; // Categorias do produto
  reviews?: any[]; // Reviews do produto
  createdAt?: string;
  updatedAt?: string;
}
