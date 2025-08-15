import type { Product } from "./Product";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: Category;
  subcategories?: Category[];
  createdAt: Date;
  updatedAt: Date;
  Product: Product[];
}
