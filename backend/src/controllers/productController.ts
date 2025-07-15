import { Request, Response } from "express";
import { ApiResponse, ProductFilters, AuthenticatedRequest } from "../types";
import { ProductService } from "../services/ProductService";
import { AuthService } from "../services/AuthService";

/**
 * Listar produtos com filtros e paginação
 */
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      categoryIds,
    }: ProductFilters = req.query;

    const filters = {
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      categoryIds: categoryIds
        ? Array.isArray(categoryIds)
          ? (categoryIds as string[])
          : [categoryIds as string]
        : undefined,
    };

    const result = await ProductService.getProducts(filters);

    res.status(200).json({
      success: true,
      data: result,
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Obter produto por ID
 */
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await ProductService.getProductById(id);

    res.status(200).json({
      success: true,
      data: { product },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);

    if (error instanceof Error && error.message === "Produto não encontrado") {
      res.status(404).json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Criar novo produto
 */
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      } as ApiResponse);
      return;
    }

    const { name, description, price, categoryIds } = req.body;

    // Validação básica
    if (!name || !description || !price) {
      res.status(400).json({
        success: false,
        error: { message: "Nome, descrição e preço são obrigatórios" },
      } as ApiResponse);
      return;
    }

    // Processar imagens do upload
    const images = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.filename)
      : [];

    const productData = {
      name,
      description,
      price: Number(price),
      images,
      sellerId: req.user.id,
      categoryIds: categoryIds || [],
    };

    const product = await ProductService.createProduct(
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
    console.error("Erro ao criar produto:", error);

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Atualizar produto
 */
export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const { name, description, price, categoryIds, status } = req.body;

    // Verificar se é admin
    const isAdmin = await AuthService.isAdmin(req.user.id);

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (categoryIds) updateData.categoryIds = categoryIds;
    if (status) updateData.status = status;

    // Processar novas imagens se enviadas
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      updateData.images = (req.files as Express.Multer.File[]).map(
        (file) => file.filename
      );
    }

    const product = await ProductService.updateProduct(
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
    console.error("Erro ao atualizar produto:", error);

    if (error instanceof Error) {
      const statusCode = error.message.includes("não encontrado")
        ? 404
        : error.message.includes("permissão")
        ? 403
        : 400;

      res.status(statusCode).json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Deletar produto
 */
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      } as ApiResponse);
      return;
    }

    const { id } = req.params;

    // Verificar se é admin
    const isAdmin = await AuthService.isAdmin(req.user.id);

    await ProductService.deleteProduct(id, req.user.id, isAdmin);

    res.status(200).json({
      success: true,
      data: { message: "Produto deletado com sucesso" },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao deletar produto:", error);

    if (error instanceof Error) {
      const statusCode = error.message.includes("não encontrado")
        ? 404
        : error.message.includes("permissão")
        ? 403
        : 400;

      res.status(statusCode).json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};
