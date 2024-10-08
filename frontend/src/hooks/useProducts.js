// src/hooks/useProducts.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:5000/api";
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`, // Retrieve token from localStorage
});

// Reusable error handler
const handleErrorResponse = async (response) => {
  const errorData = await response.json();
  throw new Error(errorData.message || "An error occurred");
};

// Fetch all products
const fetchProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};

// Fetch products by category ID (including subcategories)
const fetchProductsByCategory = async (categoryId) => {
  const response = await fetch(
    `${BASE_URL}/products/filter?category=${categoryId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
};

export const useCategoryProducts = (categoryId) => {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => fetchProductsByCategory(categoryId),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    enabled: !!categoryId, // Only fetch if categoryId is provided
  });
};

// Fetch a single product by ID
const fetchProductById = async (productId) => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useProduct = (productId) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    enabled: !!productId, // Only fetch if productId is provided
  });
};

// Add a new product
const addProduct = async (newProduct) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: newProduct,
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]); // Invalidate products query to refetch data
    },
  });
};
const updateProductById = async ({ id, formData }) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductById,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]); // Invalidate products query to refetch data
    },
    onError: (error) => {
      console.error("Error updating product:", error);
    },
  });
};

const deleteProductById = async (productId) => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete the product");
  }

  return response.json(); // Assuming your API returns a JSON response after deletion
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: deleteProductById, // Ensure mutationFn is provided
  });
};

const fetchSearchResults = async (query) => {
  const response = await fetch(`${BASE_URL}/products/search?${query}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useSearchProducts = (query) => {
  return useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => fetchSearchResults(query),
    keepPreviousData: true,
  });
};
