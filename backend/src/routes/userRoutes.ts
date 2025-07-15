import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserOrders,
} from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

/**
 * @route GET /api/users/me
 * @desc Obter dados do usuário logado (mesmo que /auth/profile)
 * @access Private
 */
router.get("/me", authenticate, (req, res) => {
  // Redireciona para o profile do auth
  res.redirect("/api/auth/profile");
});

/**
 * @route PUT /api/users/me
 * @desc Atualizar dados do usuário logado
 * @access Private
 */
router.put("/me", authenticate, (req, res) => {
  // Atualizar o próprio usuário
  updateUser(req, res);
});

/**
 * @route GET /api/users/orders
 * @desc Listar pedidos do usuário logado
 * @access Private
 */
router.get("/orders", authenticate, getUserOrders);

/**
 * @route GET /api/users
 * @desc Listar todos os usuários (admin)
 * @access Private (Admin)
 */
router.get("/", authenticate, getUsers);

/**
 * @route GET /api/users/:id
 * @desc Obter usuário por ID (admin ou próprio usuário)
 * @access Private
 */
router.get("/:id", authenticate, getUserById);

/**
 * @route PUT /api/users/:id
 * @desc Atualizar usuário (admin ou próprio usuário)
 * @access Private
 */
router.put("/:id", authenticate, updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Deletar usuário (admin)
 * @access Private (Admin)
 */
router.delete("/:id", authenticate, deleteUser);

export default router;
