import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { AuthenticatedRequest } from "../middleware/auth";

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
  categoryId: string;
  stock: number;
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  status?: any;
  categoryId?: string;
}

/**
 * @desc    Get all products with filters and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12, search, category, sort } = req.query;

    const filters = {
      page: Number(page),
      limit: Number(limit),
      search: search as string | undefined,
      category: category as string | undefined,
      sort: sort as string | undefined,
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

    const { name, description, price, stock, categoryId } = req.body;

    // Basic validation
    if (!name || !description || !price || stock === undefined) {
      res.status(400).json({
        success: false,
        error: { message: "Nome, descrição, preço e estoque são obrigatórios" },
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
      stock: Number(stock),
      images,
      sellerId: req.user.id,
      categoryId: categoryId,
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
    const { name, description, price, stock, categoryId, status } = req.body;

    const updateData: UpdateProductInput = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (categoryId) {
      updateData.categoryId = categoryId;
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
