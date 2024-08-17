// src/hooks/useCompanies.js
import { useQuery } from "@tanstack/react-query";

const fetchCompanies = async () => {
  const response = await fetch("http://localhost:5000/api/company/");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch companies");
  }
  return response.json();
};

export const useCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
