import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAllProducts() {
  return useQuery({
    queryKey: ["products", "all"],
    queryFn: () => api.getAllProducts(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts({
  query = "",
  category = "",
  skip = 0,
  limit = 10
}: {
  query?: string;
  category?: string;
  skip?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["products", { query, category, skip, limit }],
    queryFn: () => {
      if (query) {
        return api.searchProducts(query, { skip, limit });
      }
      if (category && category !== "all") {
        return api.getProductsByCategory(category, { skip, limit });
      }
      return api.getProducts({ skip, limit });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
    staleTime: Infinity,
  });
}
