import {
  Product,
  CreateProductData,
  UpdateProductData,
} from "../models/Product";
import { ProductStatus } from "../../generated/prisma";

export class ProductService {
  // Listar produtos do catálogo (público)
  static async getProducts(filters?: {
    search?: string;
    categoryIds?: string[];
    page?: number;
    limit?: number;
  }) {
    return await Product.findMany({
      ...filters,
      status: ProductStatus.Available, // Apenas produtos disponíveis
    });
  }

  // Buscar produto por ID (público)
  static async getProductById(id: string) {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    return product;
  }

  // Criar produto (admin/vendedor)
  static async createProduct(data: CreateProductData, userId: string) {
    // Verificar se o usuário é o vendedor
    if (data.sellerId !== userId) {
      throw new Error("Você só pode criar produtos para si mesmo");
    }

    return await Product.create(data);
  }

  // Atualizar produto (admin/proprietário)
  static async updateProduct(
    id: string,
    data: UpdateProductData,
    userId: string,
    isAdmin = false
  ) {
    // Verificar se o produto existe
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    // Verificar permissões (admin ou proprietário)
    if (!isAdmin && !(await Product.isOwner(id, userId))) {
      throw new Error("Você não tem permissão para editar este produto");
    }

    return await Product.update(id, data);
  }

  // Deletar produto (admin/proprietário)
  static async deleteProduct(id: string, userId: string, isAdmin = false) {
    // Verificar se o produto existe
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    // Verificar permissões (admin ou proprietário)
    if (!isAdmin && !(await Product.isOwner(id, userId))) {
      throw new Error("Você não tem permissão para deletar este produto");
    }

    await Product.delete(id);
  }

  // Listar produtos do vendedor
  static async getSellerProducts(
    sellerId: string,
    filters?: {
      search?: string;
      status?: ProductStatus;
      page?: number;
      limit?: number;
    }
  ) {
    return await Product.findMany({
      ...filters,
      sellerId,
    });
  }

  // Buscar produtos por categoria
  static async getProductsByCategory(
    categoryIds: string[],
    filters?: {
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    return await Product.findMany({
      ...filters,
      categoryIds,
      status: ProductStatus.Available,
    });
  }

  // Marcar produto como vendido
  static async markAsSold(id: string, userId: string, isAdmin = false) {
    return await this.updateProduct(
      id,
      { status: ProductStatus.Sold },
      userId,
      isAdmin
    );
  }

  // Marcar produto como disponível
  static async markAsAvailable(id: string, userId: string, isAdmin = false) {
    return await this.updateProduct(
      id,
      { status: ProductStatus.Available },
      userId,
      isAdmin
    );
  }

  // Esconder produto
  static async hideProduct(id: string, userId: string, isAdmin = false) {
    return await this.updateProduct(
      id,
      { status: ProductStatus.Hidden },
      userId,
      isAdmin
    );
  }
}
