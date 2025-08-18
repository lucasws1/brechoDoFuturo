import { useSearchParams, useMatch } from "react-router-dom";
import { useMemo } from "react";

export function useCategorySearchParams() {
  const [sp, setSp] = useSearchParams();
  const match = useMatch("/category/:slug");
  const slug = match?.params.slug ?? "";
  const search = sp.get("search") ?? "";
  const sub = sp.get("sub") ?? undefined;
  const page = Number(sp.get("page") ?? 1);
  const limit = Number(sp.get("limit") ?? 15);
  const sort = sp.get("sort") ?? "newest";
  const isSearchPage = useMatch("/search");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (sub) p.set("sub", sub);
    p.set("page", page.toString());
    p.set("limit", limit.toString());
    p.set("sort", sort);
    return p.toString();
  }, [search, slug, sub, page, limit, sort]);

  function setPage(page: number) {
    const next = new URLSearchParams(sp);
    next.set("page", String(Math.max(1, page)));
    setSp(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setLimitValue(n: number) {
    const next = new URLSearchParams(sp);
    next.set("limit", String(n));
    next.set("page", "1");
    setSp(next);
  }

  function setSortValue(s: string) {
    const next = new URLSearchParams(sp);
    next.set("sort", s);
    next.set("page", "1");
    setSp(next);
  }

  function setSubcategoryValue(s: string) {
    const next = new URLSearchParams(sp);
    if (s) next.set("sub", s);
    else next.delete("sub");
    next.set("page", "1");
    setSp(next);
  }

  return {
    slug,
    search,
    sub,
    page,
    limit,
    sort,
    params,
    setPage,
    setLimitValue,
    setSortValue,
    setSubcategoryValue,
    isSearchPage,
  };
}
