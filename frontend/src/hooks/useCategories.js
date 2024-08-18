// src/hooks/useCategories.js
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

// Fetch all categories
const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
  });
};

// Fetch a single category by ID
const fetchCategoryById = async (categoryId) => {
  const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useCategory = (categoryId) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => fetchCategoryById(categoryId),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    enabled: !!categoryId, // Only fetch if categoryId is provided
  });
};

// Update a category by ID
const updateCategoryById = async ({ id, ...categoryData }) => {
  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategoryById,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]); // Invalidate categories query to refetch data
    },
    onError: (error) => {
      console.error("Error updating category:", error);
    },
  });
};

// Delete a category by ID
const deleteCategoryById = async (id) => {
  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryById,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]); // Invalidate categories query to refetch data
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });
};

// Add a new category
const addCategory = async (categoryData) => {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]); // Invalidate categories query to refetch data
    },
    onError: (error) => {
      console.error("Error adding category:", error);
    },
  });
};
