import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define the base URL and common headers
const BASE_URL = "http://localhost:5000/api";
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
});

const handleErrorResponse = async (response) => {
  const error = await response.json();
  throw new Error(error.message || "An error occurred");
};

// Fetch all companies
const fetchCompanies = async () => {
  const response = await fetch(`${BASE_URL}/company`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useCompanies = () =>
  useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

// Fetch a single company by ID
export const useCompany = (id) =>
  useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/company/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      return response.json();
    },
    enabled: !!id, // Only run this query if the ID exists
  });

// Add a new company
const addCompany = async (companyData) => {
  const response = await fetch(`${BASE_URL}/company`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useAddCompany = () =>
  useMutation({
    mutationFn: addCompany,
  });

// Update an existing company
const updateCompany = async ({ id, ...companyData }) => {
  const response = await fetch(`${BASE_URL}/company/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]); // Invalidate and refetch companies query
    },
  });
};

// Delete a company
const deleteCompany = async (id) => {
  const response = await fetch(`${BASE_URL}/company/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]); // Invalidate and refetch companies query
    },
  });
};
