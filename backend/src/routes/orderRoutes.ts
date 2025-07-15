import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getSalesStats,
} from "../controllers/orderController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

/**
 * @route POST /api/orders
 * @desc Criar pedido (checkout)
 * @access Private
 */
router.post("/", authenticate, createOrder);

/**
 * @route GET /api/orders
 * @desc Listar pedidos (admin vê todos, usuário vê os dele)
 * @access Private
 */
router.get("/", authenticate, getOrders);

/**
 * @route GET /api/orders/stats
 * @desc Obter estatísticas de vendas (admin)
 * @access Private (Admin)
 */
router.get("/stats", authenticate, getSalesStats);

/**
 * @route GET /api/orders/:id
 * @desc Obter pedido por ID
 * @access Private (Proprietário ou Admin)
 */
router.get("/:id", authenticate, getOrderById);

/**
 * @route PUT /api/orders/:id
 * @desc Atualizar pedido (admin)
 * @access Private (Admin)
 */
router.put("/:id", authenticate, updateOrder);

/**
 * @route DELETE /api/orders/:id
 * @desc Deletar pedido (admin)
 * @access Private (Admin)
 */
router.delete("/:id", authenticate, deleteOrder);

export default router;
