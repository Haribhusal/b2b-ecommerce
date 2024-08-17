// src/hooks/useAddProduct.js
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct) => {
      console.log(newProduct);
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};
