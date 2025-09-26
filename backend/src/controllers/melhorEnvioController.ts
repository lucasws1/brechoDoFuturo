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

// CEP da loja (origem)
const STORE_POSTAL_CODE = process.env.STORE_POSTAL_CODE || "01001000";

// Tipos para validação de entrada
type ShippingItem = {
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  insuranceValue?: number;
};

type ShippingQuote = {
  id: string;
  nome: string;
  preco: number;
  prazoDias: number | null;
};

// 1) Inicia o OAuth (redirect para /oauth/authorize)
export const authorize = (_req: any, res: any) => {
  try {
    const url = getAuthUrl(["shipping-calculate", "cart-read"]);
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
    const { norm: destinationCep, items } = req.body;

    // Validação de entrada
    if (!destinationCep || !items || !Array.isArray(items)) {
      return res.status(400).json({
        error: "CEP de destino e lista de items são obrigatórios",
      });
    }

    // Validar CEP
    if (!/^\d{8}$/.test(destinationCep)) {
      return res.status(400).json({
        error: "CEP deve conter exatamente 8 dígitos",
      });
    }

    // Validar items
    for (const item of items) {
      if (
        !item.weightGrams ||
        !item.lengthCm ||
        !item.widthCm ||
        !item.heightCm
      ) {
        return res.status(400).json({
          error: "Todos os items devem ter peso, comprimento, largura e altura",
        });
      }
    }

    // Verificar tokens
    let storedToken = await getStoredTokens();

    if (!storedToken?.accessToken) {
      return res.status(401).json({
        error: "API não autorizada. Configure a autenticação do Melhor Envio.",
      });
    }

    // Renovar token se necessário
    if (!isTokenValid(storedToken)) {
      if (!storedToken.refreshToken) {
        return res.status(401).json({
          error: "Token expirado. Configure novamente a autenticação.",
        });
      }

      const newToken = await refreshAccessToken(storedToken.refreshToken);
      await saveTokens(newToken);
      storedToken = await getStoredTokens();
    }

    // Transformar items para o formato do Melhor Envio
    const products = items.map((item: ShippingItem, index: number) => ({
      id: `item-${index}`,
      width: item.widthCm,
      height: item.heightCm,
      length: item.lengthCm,
      weight: item.weightGrams / 1000, // Converter gramas para kg
      insurance_value: item.insuranceValue || 10, // valor mínimo de seguro
      quantity: 1,
    }));

    const payload = {
      from: {
        postal_code: STORE_POSTAL_CODE,
      },
      to: {
        postal_code: destinationCep,
      },
      products,
    };

    // Calcular frete usando a API do Melhor Envio
    const result = await calculateShipment(storedToken!.accessToken, payload);

    // Transformar resposta para o formato esperado pelo frontend
    const quotes: ShippingQuote[] = result.map((quote: any) => ({
      id: quote.id.toString(),
      nome: `${quote.company?.name || "N/A"} - ${quote.name || "N/A"}`,
      preco: quote.price ? parseFloat(quote.price) : null,
      prazoDias: quote.delivery_time || null,
    }));

    return res.json(quotes);
  } catch (error: any) {
    console.error(
      "Erro ao calcular frete:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error: error.message || "Erro interno do servidor",
    });
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
