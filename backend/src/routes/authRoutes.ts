import { Router } from "express";
import {
  register,
  login,
  getProfile,
  logout,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

/**
 * @route POST /api/auth/register
 * @desc Registrar novo usuário
 * @access Public
 */
router.post("/register", register);

/**
 * @route POST /api/auth/login
 * @desc Login do usuário
 * @access Public
 */
router.post("/login", login);

/**
 * @route GET /api/auth/profile
 * @desc Obter perfil do usuário logado
 * @access Private
 */
router.get("/profile", authenticate, getProfile);

/**
 * @route POST /api/auth/logout
 * @desc Logout do usuário
 * @access Private
 */
router.post("/logout", authenticate, logout);

export default router;
