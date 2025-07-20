import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { AuthenticatedRequest } from "../middleware/auth";
import { mockProducts } from "../utils/mockProducts"; // Importando os produtos mock

// Tipos para responses
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
// Função helper para tratar erros
const handleError = (res: Response, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({
    success: false,
    error: { message: (error as Error).message || message },
  });
};

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  images: string[];
  sellerId: string;
  categoryIds: string[];
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  status?: any;
  categoryIds?: string[];
}

/**
 * @desc    Get all products with filters and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;

    const filters = {
      page: Number(page),
      limit: Number(limit),
      search: search as string | undefined,
      category: category as string | undefined,
    };

    const result = await productService.getProducts(filters);

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.pages,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar produtos");
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id as string);

    if (!product) {
      res.status(404).json({
        success: false,
        error: { message: "Produto não encontrado" },
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar produto");
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Seller
 */
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
      return;
    }

    const { name, description, price, categoryIds } = req.body;

    // Basic validation
    if (!name || !description || !price) {
      res.status(400).json({
        success: false,
        error: { message: "Nome, descrição e preço são obrigatórios" },
      } as ApiResponse);
    }

    // Process uploaded images
    const images = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.filename)
      : [];

    const productData: CreateProductInput = {
      name,
      description,
      price: Number(price),
      images,
      sellerId: req.user.id,
      categoryIds: Array.isArray(categoryIds)
        ? categoryIds
        : [categoryIds].filter(Boolean),
    };

    const product = await productService.createProduct(
      productData,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: {
        message: "Produto criado com sucesso",
        product,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao criar produto");
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Seller,Admin
 */
export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const { name, description, price, categoryIds, status } = req.body;

    const updateData: UpdateProductInput = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (categoryIds) {
      updateData.categoryIds = Array.isArray(categoryIds)
        ? categoryIds
        : [categoryIds].filter(Boolean);
    }
    if (status) updateData.status = status;

    // Process new images if uploaded
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      updateData.images = (req.files as Express.Multer.File[]).map(
        (file) => file.filename
      );
    }

    const isAdmin = req.user.type === "Admin";
    const product = await productService.updateProduct(
      id,
      updateData,
      req.user.id,
      isAdmin
    );

    res.status(200).json({
      success: true,
      data: {
        message: "Produto atualizado com sucesso",
        product,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao atualizar produto");
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Seller,Admin
 */
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Não autorizado" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const isAdmin = req.user.type === "Admin";
    await productService.deleteProduct(id, req.user.id, isAdmin);

    res.status(200).json({
      success: true,
      data: {
        message: "Produto excluído com sucesso",
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao excluir produto");
  }
};

/**
 * @desc    Get mock products for testing pagination
 * @route   GET /api/products/mock
 * @access  Public
 */
export const getMockProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 8, search, category } = req.query;

    // Aplicar filtros
    let filteredProducts = mockProducts;

    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // Calcular paginação
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limitNum);
    const skip = (pageNum - 1) * limitNum;

    // Aplicar paginação
    const paginatedProducts = filteredProducts.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar produtos mock");
  }
};

export const getMockProductsById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: { message: "Produto não encontrado" },
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    } as ApiResponse);
  } catch (error) {
    handleError(res, error, "Erro ao buscar produto mock");
  }
};
