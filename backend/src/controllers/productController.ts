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

    // Dados mock para teste
    const mockProducts = [
      {
        id: "1",
        name: "Camiseta Vintage",
        price: 49.9,
        image: "https://picsum.photos/300/300?random=1",
        category: "Masculino",
        description: "Camiseta retrô em algodão sustentável.",
        stock: 15,
      },
      {
        id: "2",
        name: "Vestido Floral",
        price: 89.9,
        image: "https://picsum.photos/300/300?random=2",
        category: "Feminino",
        description: "Vestido leve, perfeito para o verão.",
        stock: 8,
      },
      {
        id: "3",
        name: "Calça Jeans Skinny",
        price: 129.9,
        image: "https://picsum.photos/300/300?random=3",
        category: "Feminino",
        description: "Calça jeans skinny de alta qualidade.",
        stock: 12,
      },
      {
        id: "4",
        name: "Blazer Casual",
        price: 199.9,
        image: "https://picsum.photos/300/300?random=4",
        category: "Masculino",
        description: "Blazer elegante para ocasiões especiais.",
        stock: 5,
      },
      {
        id: "5",
        name: "Saia Midi Plissada",
        price: 79.9,
        image: "https://picsum.photos/300/300?random=5",
        category: "Feminino",
        description: "Saia midi plissada, versátil e confortável.",
        stock: 20,
      },
      {
        id: "6",
        name: "Camisa Social",
        price: 149.9,
        image: "https://picsum.photos/300/300?random=6",
        category: "Masculino",
        description: "Camisa social de algodão egípcio.",
        stock: 10,
      },
      {
        id: "7",
        name: "Jaqueta Bomber",
        price: 179.9,
        image: "https://picsum.photos/300/300?random=7",
        category: "Unissex",
        description: "Jaqueta bomber estilo streetwear.",
        stock: 7,
      },
      {
        id: "8",
        name: "Blusa de Tricô",
        price: 99.9,
        image: "https://picsum.photos/300/300?random=8",
        category: "Feminino",
        description: "Blusa de tricô macia e aconchegante.",
        stock: 18,
      },
      {
        id: "9",
        name: "Tênis Casual",
        price: 159.9,
        image: "https://picsum.photos/300/300?random=9",
        category: "Unissex",
        description: "Tênis confortável para o dia a dia.",
        stock: 25,
      },
      {
        id: "10",
        name: "Shorts Esportivo",
        price: 69.9,
        image: "https://picsum.photos/300/300?random=10",
        category: "Masculino",
        description: "Shorts esportivo com tecnologia dry-fit.",
        stock: 30,
      },
      {
        id: "11",
        name: "Cardigan Oversized",
        price: 119.9,
        image: "https://picsum.photos/300/300?random=11",
        category: "Feminino",
        description: "Cardigan oversized, perfeito para o inverno.",
        stock: 12,
      },
      {
        id: "12",
        name: "Cinto de Couro",
        price: 89.9,
        image: "https://picsum.photos/300/300?random=12",
        category: "Masculino",
        description: "Cinto de couro genuíno, elegante e durável.",
        stock: 15,
      },
      {
        id: "13",
        name: "Bolsa Transversal",
        price: 189.9,
        image: "https://picsum.photos/300/300?random=13",
        category: "Feminino",
        description: "Bolsa transversal em couro sintético.",
        stock: 9,
      },
      {
        id: "14",
        name: "Relógio Minimalista",
        price: 299.9,
        image: "https://picsum.photos/300/300?random=14",
        category: "Unissex",
        description: "Relógio com design minimalista e elegante.",
        stock: 6,
      },
      {
        id: "15",
        name: "Óculos de Sol",
        price: 129.9,
        image: "https://picsum.photos/300/300?random=15",
        category: "Unissex",
        description: "Óculos de sol com proteção UV.",
        stock: 22,
      },
      {
        id: "16",
        name: "Colar Delicado",
        price: 79.9,
        image: "https://picsum.photos/300/300?random=16",
        category: "Feminino",
        description: "Colar delicado em prata 925.",
        stock: 35,
      },
      {
        id: "17",
        name: "Pulseira de Couro",
        price: 59.9,
        image: "https://picsum.photos/300/300?random=17",
        category: "Unissex",
        description: "Pulseira de couro artesanal.",
        stock: 28,
      },
      {
        id: "18",
        name: "Anel Prateado",
        price: 89.9,
        image: "https://picsum.photos/300/300?random=18",
        category: "Feminino",
        description: "Anel em prata 925 com pedra natural.",
        stock: 14,
      },
      {
        id: "19",
        name: "Perfume Masculino",
        price: 249.9,
        image: "https://picsum.photos/300/300?random=19",
        category: "Masculino",
        description: "Perfume masculino com fragrância duradoura.",
        stock: 11,
      },
      {
        id: "20",
        name: "Perfume Feminino",
        price: 269.9,
        image: "https://picsum.photos/300/300?random=20",
        category: "Feminino",
        description: "Perfume feminino com notas florais.",
        stock: 13,
      },
    ];

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
