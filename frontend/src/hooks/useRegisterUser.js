import { useMutation } from "@tanstack/react-query";

const registerUser = async (userData) => {
  const response = await fetch("http://localhost:5000/api/sellers/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }

  return response.json();
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      console.error("Error:", error);
    },
  });
};
