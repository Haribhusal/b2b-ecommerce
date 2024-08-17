import { useMutation } from "@tanstack/react-query";

const deleteProductById = async (productId) => {
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  const response = await fetch(
    `http://localhost:5000/api/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
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
