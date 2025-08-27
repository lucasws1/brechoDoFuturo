import { calculateShipment, refreshAccessToken } from "./melhorEnvio.service";
import {
  getStoredTokens,
  isTokenValid,
  saveTokens,
} from "./melhorEnvioToken.service";

// CEP da loja (origem)
const STORE_POSTAL_CODE = process.env.STORE_POSTAL_CODE || "01001000";

type ShippingItem = {
  pesoKg: number;
  comprimentoCm: number;
  larguraCm: number;
  alturaCm: number;
  valor?: number;
};

type ShippingQuote = {
  id: string;
  nome: string;
  preco: number;
  prazoDias: number | null;
};

export async function calculateShipping(
  destinationCep: string,
  items: ShippingItem[]
): Promise<ShippingQuote[]> {
  // Verificar se temos tokens válidos
  let storedToken = await getStoredTokens();

  if (!storedToken?.accessToken) {
    throw new Error(
      "API não autorizada. Configure a autenticação do Melhor Envio."
    );
  }

  // Renovar token se necessário
  if (!isTokenValid(storedToken)) {
    if (!storedToken.refreshToken) {
      throw new Error("Token expirado. Configure novamente a autenticação.");
    }

    const newToken = await refreshAccessToken(storedToken.refreshToken);
    await saveTokens(newToken);
    storedToken = await getStoredTokens();
  }

  // Transformar items para o formato do Melhor Envio
  const products = items.map((item, index) => ({
    id: `item-${index}`,
    width: item.larguraCm,
    height: item.alturaCm,
    length: item.comprimentoCm,
    weight: item.pesoKg,
    insurance_value: item.valor || 10, // valor mínimo de seguro
    quantity: 1,
  }));

  const payload = {
    from: {
      postal_code: STORE_POSTAL_CODE,
    },
    to: {
      postal_code: destinationCep.replace(/\D/g, ""),
    },
    products,
  };

  try {
    const result = await calculateShipment(storedToken!.accessToken, payload);

    // Transformar resposta para o formato esperado pelo frontend
    return result.map(
      (quote: any): ShippingQuote => ({
        id: quote.id.toString(),
        nome: `${quote.company.name} - ${quote.name}`,
        preco: parseFloat(quote.price),
        prazoDias: quote.delivery_time || null,
      })
    );
  } catch (error: any) {
    console.error(
      "Erro ao calcular frete:",
      error.response?.data || error.message
    );
    throw new Error("Falha ao calcular frete. Tente novamente.");
  }
}
