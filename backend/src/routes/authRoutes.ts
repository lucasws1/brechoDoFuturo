import { Router } from "express";
import {
  register,
  login,
  getProfile,
  logout,
  refreshToken,
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

router.post("/refresh", authenticate, refreshToken);

/**
 * @route GET /api/auth/profile
 * @desc Obter perfil do usuário logado
 * @access Private
 */
router.get("/profile", authenticate, getProfile);

/**
 * @route GET /api/auth/logout
 * @desc Logout do usuário
 * @access Private
 */
router.get("/logout", authenticate, logout);

export default router;
