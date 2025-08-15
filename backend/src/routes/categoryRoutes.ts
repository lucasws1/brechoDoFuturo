import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  getCategoryHierarchy,
  getCategoryBySlug,
} from "../controllers/categoryController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

// Rotas públicas
router.get("/", getCategories);
router.get("/id/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/hierarchy/:slug", getCategoryHierarchy);

// Rotas privadas (requerem autenticação)
router.post("/", authenticate, createCategory);
router.put("/:id", authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);
router.get("/:id/stats", authenticate, getCategoryStats);

export default router;
