// src/hooks/useCategories.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchCategories = async () => {
  const response = await fetch("http://localhost:5000/api/categories/");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

const fetchCategoryById = async (categoryId) => {
  const response = await fetch(
    `http://localhost:5000/api/categories/${categoryId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useCategory = (categoryId) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => fetchCategoryById(categoryId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!categoryId, // Only fetch if productId is provided
  });
};

const updateCategoryById = async ({ id, ...categoryData }) => {
  const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update the category");
  }

  return response.json();
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategoryById,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      console.log("Category updated successfully");
    },
    onError: (error) => {
      console.error("Error updating category:", error);
    },
  });
};

const deleteCategoryById = async (id) => {
  const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete the category");
  }

  return response.json();
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryById,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      console.log("Category deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });
};

const addCategory = async (categoryData) => {
  const response = await fetch("http://localhost:5000/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add the category");
  }

  return response.json();
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      console.log("Category added successfully");
    },
    onError: (error) => {
      console.error("Error adding category:", error);
    },
  });
};
