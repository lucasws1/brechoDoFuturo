import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Configuração da API baseada no ambiente
// Para desenvolvimento local, usar proxy do Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

type Item = {
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  insuranceValue?: number;
};

export type Quote = {
  id: string;
  nome: string;
  preco: number;
  prazoDias: number | null;
};

type Props = {
  items: Item[];
  defaultCep?: string;
  onSelect?: (q: Quote | null) => void;
  selected?: string;
};

const cache = new Map<string, Quote[]>();

export default function ShippingCalculator({
  items,
  defaultCep = "",
  onSelect,
}: Props) {
  const [cep, setCep] = useState(defaultCep);
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const key = useMemo(() => {
    const norm = cep.replace(/\D/g, "");
    const hash = JSON.stringify(items);
    return `${norm}:${hash}`;
  }, [cep, items]);

  async function fetchQuotes() {
    const norm = cep.replace(/\D/g, "");
    if (norm.length !== 8 || !/^[0-9]*$/.test(norm)) {
      setError("Insira um CEP válido");
      setQuotes(null);
      onSelect?.(null);
      return;
    }

    if (cache.has(key)) {
      setQuotes(cache.get(key)!);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}/melhorenvio/quote`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ norm, items }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        let errorMessage = "Falha ao cotar o frete";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch (parseError) {
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      cache.set(key, data);
      setQuotes(data);
    } catch (e: any) {
      setError(e.message || "Erro ao cotar o frete");
      setQuotes(null);
    } finally {
      setLoading(false);
    }
  }

  // recalcular quando itens mudarem e já existir cep valido
  useEffect(() => {
    if (cep.length === 8 && /^[0-9]*$/.test(cep)) {
      fetchQuotes();
    }
  }, [items]);

  useEffect(() => {
    const q = quotes?.find((q) => q.id === selected) || null;
    onSelect?.(q ?? null);
  }, [selected, quotes, onSelect]);

  return (
    <div>
      <div className="flex flex-col gap-2">
        <p>Calcular Frete</p>
        <Input
          inputMode="numeric"
          maxLength={9}
          placeholder="Digite o CEP"
          className="w-fit"
          id="cep"
          name="cep"
          value={cep}
          onChange={(e) => {
            setCep(e.target.value);
          }}
        />
        <Button
          variant="outline"
          className="w-fit cursor-pointer items-center"
          onClick={fetchQuotes}
          disabled={loading}
        >
          <MapPin /> {loading ? "Calculando..." : "Calcular"}
        </Button>
      </div>
      {error && <p className="pt-2">{error}</p>}
      {quotes && quotes.length > 0 && (
        <ul className="mt-2 space-y-1">
          {quotes.map((q) => (
            <li
              key={q.id}
              className="flex w-full flex-col gap-1 truncate rounded-md border p-2"
            >
              <div className="flex w-full justify-start">
                <Label className="flex w-fit gap-2">
                  <Input
                    type="radio"
                    name="shipping"
                    className="size-3 max-w-4 min-w-4 cursor-pointer"
                    checked={selected === q.id}
                    onChange={() => setSelected(q.id)}
                  />
                  <span className="w-fit text-sm">{q.nome}</span>
                </Label>
              </div>
              <div className="flex w-full gap-2">
                <div className="max-w-4 min-w-4"></div>
                <span className="w-fit truncate text-xs">
                  {q.preco
                    ? `R$ ${q.preco.toFixed(2)}`
                    : "Preço não disponível"}
                </span>

                {q.prazoDias ? (
                  <span className="w-fit truncate text-xs">
                    ({q.prazoDias} dias)
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      {quotes && quotes.length === 0 && (
        <p className="text-sm">Sem opções para este CEP. Tente outro CEP.</p>
      )}
    </div>
  );
}
