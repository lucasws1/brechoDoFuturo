import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMockProducts,
} from "../controllers/productController";
import { authenticate } from "../middleware/auth";
import { uploadProductImages } from "../middleware/upload";

const router: Router = Router();

/**
 * @route GET /api/products
 * @desc Listar produtos (catálogo)
 * @access Public
 */
router.get("/", getProducts);

/**
 * @route GET /api/products/mock
 * @desc Listar produtos mock para testes de paginação
 * @access Public
 */
router.get("/mock", getMockProducts);

/**
 * @route GET /api/products/:id
 * @desc Obter produto por ID
 * @access Public
 */
router.get("/:id", getProductById);

/**
 * @route POST /api/products
 * @desc Criar novo produto
 * @access Private (Autenticado)
 */
router.post("/", authenticate, uploadProductImages, createProduct);

/**
 * @route PUT /api/products/:id
 * @desc Atualizar produto
 * @access Private (Proprietário ou Admin)
 */
router.put("/:id", authenticate, uploadProductImages, updateProduct);

/**
 * @route DELETE /api/products/:id
 * @desc Deletar produto
 * @access Private (Proprietário ou Admin)
 */
router.delete("/:id", authenticate, deleteProduct);

export default router;
