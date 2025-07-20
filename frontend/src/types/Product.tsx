export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string; // Campo opcional para compatibilidade
  images?: string[]; // Array de imagens do backend
  category?: string; // Campo opcional pois o backend não retorna
  description: string;
  stock?: number;
  status?: string; // Status do produto
  sellerId?: string; // ID do vendedor
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  categoryIds?: string[]; // IDs das categorias
  categories?: any[]; // Categorias do produto
  reviews?: any[]; // Reviews do produto
  createdAt?: string;
  updatedAt?: string;
}
