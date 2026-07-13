export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  images: string[];
  thumbnail: string;
  tags: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

const BASE_URL = "https://dummyjson.com/products";

export const api = {
  getProducts: async ({ limit = 10, skip = 0 }: { limit?: number; skip?: number }): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  getAllProducts: async (): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}?limit=0`);
    if (!res.ok) throw new Error("Failed to fetch all products");
    return res.json();
  },

  searchProducts: async (query: string, { limit = 10, skip = 0 }: { limit?: number; skip?: number }): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error("Failed to search products");
    return res.json();
  },

  getProductsByCategory: async (category: string, { limit = 10, skip = 0 }: { limit?: number; skip?: number }): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error("Failed to fetch category products");
    return res.json();
  },

  getProduct: async (id: number | string): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  }
};
