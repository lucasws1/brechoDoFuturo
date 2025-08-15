import { useState, useEffect } from "react";
import api from "@/services/api";
import type { Category } from "@/types/Category";

interface CategoryHierarchy {
  id: string;
  name: string;
  description?: string;
}

export const useCategory = (categorySlug: string | null) => {
  const [hierarchy, setHierarchy] = useState<CategoryHierarchy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryBySlug = async (slug: string) => {
    const response = await api.get(`/categories/slug/${slug}`);
    if (response.data.success) {
      return response.data.data;
    }
    return response.data.error;
  };

  useEffect(() => {
    if (!categorySlug || categorySlug === "Explorar") {
      setHierarchy([]);
      return;
    }

    const fetchHierarchy = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/categories/hierarchy/${categorySlug}`);

        if (response.data.success) {
          setHierarchy(response.data.data);
        } else {
          setError("Erro ao buscar hierarquia da categoria");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.error?.message || "Erro ao buscar hierarquia",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, [categorySlug]);

  return { hierarchy, loading, error, fetchCategoryBySlug };
};
