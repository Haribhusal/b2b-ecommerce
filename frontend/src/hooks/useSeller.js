import { useQuery, useMutation } from "@tanstack/react-query";

// Define the base URL and common headers
const BASE_URL = "http://localhost:5000/api";
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
});

const handleErrorResponse = async (response) => {
  const error = await response.json();
  throw new Error(error.message || "An error occurred");
};

// Fetch all sellers
const fetchSellers = async () => {
  const response = await fetch(`${BASE_URL}/sellers`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useSellers = () =>
  useQuery({
    queryKey: ["sellers"],
    queryFn: fetchSellers,
  });

// Fetch a single seller by ID
export const useSeller = (id) =>
  useQuery({
    queryKey: ["seller", id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/sellers/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      return response.json();
    },
  });

// Add a new seller
const addSeller = async (sellerData) => {
  const response = await fetch(`${BASE_URL}/sellers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(sellerData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useAddSeller = () =>
  useMutation({
    mutationFn: addSeller,
  });

// Update an existing seller
const updateSeller = async ({ id, ...sellerData }) => {
  const response = await fetch(`${BASE_URL}/sellers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(sellerData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useUpdateSeller = () =>
  useMutation({
    mutationFn: updateSeller,
  });

// Delete a seller
const deleteSeller = async (id) => {
  const response = await fetch(`${BASE_URL}/sellers/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useDeleteSeller = () =>
  useMutation({
    mutationFn: deleteSeller,
  });
