import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { Label } from "./ui/label";

type Item = {
  pesoKg: number;
  comprimentoCm: number;
  larguraCm: number;
  alturaCm: number;
  valor?: number;
};

type Quote = {
  id: string;
  nome: string;
  preco: number;
  prazoDias: number | null;
};

type Props = {
  items: Item[];
  defaultCep?: string;
  onSelect?: (q: Quote | null) => void;
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
      setError("CEP inválido");
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
      const response = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ norm, items }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || "Falha ao cotar");
      }
      const data = await response.json();
      cache.set(key, data);
      setQuotes(data);
    } catch (e: any) {
      setError(e.message || "Erro ao cotar");
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
      {error && <p className="text-red-500">{error}</p>}
      {quotes && quotes.length > 0 && (
        <ul className="mt-2 space-y-1">
          {quotes.map((q) => (
            <li
              key={q.id}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <Label className="flex cursor-pointer items-center gap-2">
                <Input
                  type="radio"
                  name="shipping"
                  checked={selected === q.id}
                  onChange={() => setSelected(q.id)}
                />
                <span>{q.nome}</span>
              </Label>
              <div className="text-sm">
                <span className="mr-2">R$ {q.preco.toFixed(2)}</span>
                {q.prazoDias ? <span>({q.prazoDias} d úteis)</span> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      {quotes && quotes.length === 0 && (
        <p className="text-sm">Sem opções para este CEP</p>
      )}
    </div>
  );
}
