import { Router } from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartTotal,
  getCartCheckout,
} from "../controllers/cartController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

// Todas as rotas de carrinho requerem autenticação
router.use(authenticate);

// Rotas do carrinho
router.get("/", getCart);
router.delete("/", clearCart);
router.get("/total", getCartTotal);
router.get("/checkout", getCartCheckout);

// Rotas dos itens do carrinho
router.post("/items", addItemToCart);
router.put("/items/:itemId", updateCartItem);
router.delete("/items/:itemId", removeCartItem);

export default router;
