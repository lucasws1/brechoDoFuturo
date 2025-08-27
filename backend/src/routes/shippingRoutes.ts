import { Router } from "express";
import { calculateShippingQuote } from "../controllers/shippingController";

const router: Router = Router();

// Calcular cotação de frete
router.post("/quote", calculateShippingQuote);

export default router;
