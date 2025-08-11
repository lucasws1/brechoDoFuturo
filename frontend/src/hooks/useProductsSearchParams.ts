import { useSearchParams, useMatch } from "react-router-dom";
import { useEffect, useMemo } from "react";

export function useProductsSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const match = useMatch("/category/:slug");
  const slug = match?.params.slug ?? "";

  const page = Math.max(1, Number(searchParams.get("page")) ?? 1);
  const limitParam = searchParams.get("limit");

  // Correção: Se limit for 1 ou inválido, forçar para 12
  let limit = limitParam ? Number(limitParam) : 12;
  if (limit === 1 || limit < 1 || isNaN(limit)) {
    limit = 12;
    // Remover o parâmetro limit inválido da URL
    if (limitParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("limit");
      setSearchParams(newParams, { replace: true });
    }
  }

  limit = Math.min(60, Math.max(1, limit));
  const sort = searchParams.get("sort") || "newest";
  const subcategory = searchParams.get("sub") || "";

  // Resetar page quando filtros mudam
  useEffect(() => {
    const current = Number(searchParams.get("page")) ?? 1;
    if (current !== 1) {
      const next = new URLSearchParams(searchParams);
      next.set("page", "1");
      setSearchParams(next, { replace: true });
    }
    // slug/sub/sort mudaram? zera page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, subcategory, sort]);

  const params = useMemo(
    () => ({ slug, subcategory, sort, page, limit }),
    [slug, subcategory, sort, page, limit],
  );

  function setPage(page: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(Math.max(1, page)));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setLimitValue(n: number) {
    const next = new URLSearchParams(searchParams);
    next.set("limit", String(n));
    next.set("page", "1");
    setSearchParams(next);
  }

  function setSortValue(s: string) {
    const next = new URLSearchParams(searchParams);
    next.set("sort", s);
    next.set("page", "1");
    setSearchParams(next);
  }

  function setSubcategoryValue(s: string) {
    const next = new URLSearchParams(searchParams);
    if (s) next.set("sub", s);
    else next.delete("sub");
    next.set("page", "1");
    setSearchParams(next);
  }

  return { params, setPage, setLimitValue, setSortValue, setSubcategoryValue };
}
