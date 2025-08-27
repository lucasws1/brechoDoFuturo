import { calculateShipping } from "../services/shipping.service";

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
        !item.pesoKg ||
        !item.comprimentoCm ||
        !item.larguraCm ||
        !item.alturaCm
      ) {
        return res.status(400).json({
          error: "Todos os items devem ter peso, comprimento, largura e altura",
        });
      }
    }

    const quotes = await calculateShipping(destinationCep, items);

    return res.json(quotes);
  } catch (error: any) {
    console.error("Erro ao calcular frete:", error.message);
    return res.status(500).json({
      error: error.message || "Erro interno do servidor",
    });
  }
};
