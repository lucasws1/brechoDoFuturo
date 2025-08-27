import {
  exchangeCodeForToken,
  refreshAccessToken,
  calculateShipment,
  getAuthUrl,
} from "../services/melhorEnvio.service";
import {
  saveTokens,
  getStoredTokens,
  isTokenValid,
  clearTokens,
  type TokenData,
} from "../services/melhorEnvioToken.service";

// 1) Inicia o OAuth (redirect para /oauth/authorize)
export const authorize = (_req: any, res: any) => {
  try {
    const url = getAuthUrl(["shipping-calculate", "cart-read"]);
    console.log("Generated Auth URL:", url);
    return res.redirect(url);
  } catch (error: any) {
    console.error("Authorization error:", error);
    return res.status(500).json({
      error: "Erro ao gerar URL de autorização",
      details: error.message,
    });
  }
};

// Endpoint para debug - mostra a URL sem redirect
export const getAuthUrlDebug = (_req: any, res: any) => {
  try {
    const url = getAuthUrl(["shipping-calculate", "cart-read"]);
    return res.json({
      authUrl: url,
      config: {
        clientId: process.env.ME_CLIENT_ID,
        redirectUri: process.env.ME_REDIRECT_URI,
        baseUrl:
          process.env.ME_BASE_URL || "https://sandbox.melhorenvio.com.br",
      },
    });
  } catch (error: any) {
    console.error("Debug URL error:", error);
    return res.status(500).json({
      error: "Erro ao gerar URL de debug",
      details: error.message,
    });
  }
};

export const callback = async (req: any, res: any) => {
  try {
    const { code, error, error_description } = req.query as {
      code?: string;
      error?: string;
      error_description?: string;
    };

    if (error) {
      return res.status(400).json({ error, error_description });
    }

    if (!code) {
      return res.status(400).json({ error: "Informe code" });
    }

    const token = await exchangeCodeForToken(code);

    // Salva os tokens no banco de dados
    await saveTokens(token);

    return res.json({ ok: true, token });
  } catch (e: any) {
    console.error(e?.response?.data || e?.message);
    return res
      .status(e?.response?.status || 500)
      .json(e?.response?.data || { error: "Falha no callback" });
  }
};

export const refresh = async (_req: any, res: any) => {
  try {
    const storedToken = await getStoredTokens();

    if (!storedToken?.refreshToken) {
      return res.status(400).json({ error: "No refresh_token" });
    }

    const t = await refreshAccessToken(storedToken.refreshToken);
    await saveTokens(t);

    return res.json({ ok: true, token: t });
  } catch (e: any) {
    console.error(e?.response?.data || e?.message);
    return res
      .status(e?.response?.status || 500)
      .json(e?.response?.data || { error: "Falha ao renovar token" });
  }
};

export const calculate = async (req: any, res: any) => {
  try {
    const storedToken = await getStoredTokens();

    if (!storedToken?.accessToken) {
      return res
        .status(401)
        .json({ error: "Não autenticado. Faça o OAuth primeiro." });
    }

    // Verifica se o token expirou e renova se necessário
    if (!isTokenValid(storedToken)) {
      if (!storedToken.refreshToken) {
        return res.status(401).json({
          error: "Token expirado e sem refresh token. Faça o OAuth novamente.",
        });
      }

      const t = await refreshAccessToken(storedToken.refreshToken);
      await saveTokens(t);

      // Recupera o token atualizado
      const updatedToken = await getStoredTokens();
      if (!updatedToken?.accessToken) {
        return res.status(500).json({ error: "Erro ao renovar token" });
      }

      const result = await calculateShipment(
        updatedToken.accessToken,
        req.body
      );
      return res.json(result);
    }

    const result = await calculateShipment(storedToken.accessToken, req.body);
    return res.json(result);
  } catch (e: any) {
    console.error(e?.response?.data || e?.message);
    return res
      .status(e?.response?.status || 500)
      .json(e?.response?.data || { error: "Falha ao calcular frete" });
  }
};

// Endpoint para verificar status dos tokens
export const getTokenStatus = async (_req: any, res: any) => {
  try {
    const storedToken = await getStoredTokens();

    if (!storedToken) {
      return res.json({
        hasTokens: false,
        message: "Nenhum token encontrado. Faça a autenticação primeiro.",
      });
    }

    const isValid = isTokenValid(storedToken);

    return res.json({
      hasTokens: true,
      hasAccessToken: !!storedToken.accessToken,
      hasRefreshToken: !!storedToken.refreshToken,
      isValid,
      expiresAt: storedToken.expiresAt,
      createdAt: storedToken.createdAt,
    });
  } catch (error: any) {
    console.error("Erro ao verificar status dos tokens:", error);
    return res.status(500).json({ error: "Erro ao verificar tokens" });
  }
};

// Endpoint para limpar tokens (logout)
export const logout = async (_req: any, res: any) => {
  try {
    await clearTokens();
    return res.json({ ok: true, message: "Tokens removidos com sucesso" });
  } catch (error: any) {
    console.error("Erro ao limpar tokens:", error);
    return res.status(500).json({ error: "Falha ao limpar tokens" });
  }
};
