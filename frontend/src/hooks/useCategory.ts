import { useState } from "react";
import api from "@/services/api";

export const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryBySlug = async (slug: string) => {
    setLoading(true);
    setError(null);
    const response = await api.get(`/categories/slug/${slug}`);
    const data = response.data;

    if (data.success) {
      setLoading(false);
      return data.data;
    } else {
      setLoading(false);
      setError(data.error);
      throw new Error(data.error);
    }
  };

  return { loading, fetchCategoryBySlug, error };
};
