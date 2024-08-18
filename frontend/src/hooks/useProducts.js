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
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(newProduct),
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

// Update a product by ID
const updateProductById = async ({ id, ...productData }) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(productData),
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
  const response = await fetch(
    `http://localhost:5000/api/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    }
  );

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
