import {
  authorize,
  refresh,
  calculate,
  callback,
  logout,
  getAuthUrlDebug,
  getTokenStatus,
} from "../controllers/melhorEnvioController";
import { Router } from "express";

const router: Router = Router();

// Teste básico
router.get("/test", (req, res) => {
  res.json({ message: "Melhor Envio API funcionando!" });
});

// Gera URL de autorização
router.get("/authorize", authorize);
// Debug da URL de autorização (sem redirect)
router.get("/debug-auth-url", getAuthUrlDebug);
// Verificar status dos tokens
router.get("/token-status", getTokenStatus);
// Callback do OAuth
router.get("/callback", callback);
// Atualizar token
router.post("/refresh", refresh);
// Calcular frete (requisição autenticada)
router.post("/calculate", calculate);
// Logout (limpar tokens)
router.post("/logout", logout);

export default router;
