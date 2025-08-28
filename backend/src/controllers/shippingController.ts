import { calculateShipment } from "../services/melhorEnvio.service";
import {
  getStoredTokens,
  isTokenValid,
  saveTokens,
} from "../services/melhorEnvioToken.service";
import { refreshAccessToken } from "../services/melhorEnvio.service";

// CEP da loja (origem)
const STORE_POSTAL_CODE = process.env.STORE_POSTAL_CODE || "01001000";

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

export const calculateShippingQuote = async (req: any, res: any) => {
  try {
    const { norm: destinationCep, items } = req.body;

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

    // Verificar tokens (reutilizando a lógica do melhorEnvioController)
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

    // Usar a função existente do melhorEnvio.service
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
