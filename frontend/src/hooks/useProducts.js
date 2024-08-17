// src/hooks/useProducts.js
import { useQuery } from "@tanstack/react-query";

const fetchProducts = async () => {
  const response = await fetch("http://localhost:5000/api/products");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const fetchProductById = async (productId) => {
  const response = await fetch(
    `http://localhost:5000/api/products/${productId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useProduct = (productId) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!productId, // Only fetch if productId is provided
  });
};
