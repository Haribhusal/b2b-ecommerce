import { useMutation, useQueryClient } from "@tanstack/react-query";

// Function to update a product by ID
const updateProductById = async ({ id, ...productData }) => {
  const response = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Ensure JSON content type
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update the product");
  }

  return response.json();
};

// Custom hook for updating a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient(); // Get the query client instance

  return useMutation({
    mutationFn: updateProductById,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);

      // Optionally, you can invalidate queries or perform other actions on success
      console.log("Product updated successfully");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
    },
  });
};
