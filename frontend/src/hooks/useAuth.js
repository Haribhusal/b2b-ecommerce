import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api/sellers";
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
});

// Handle errors
const handleErrorResponse = async (response) => {
  const errorData = await response.json();
  throw new Error(errorData.message || "An error occurred");
};

// Login user
const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
};

// Register user
const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
};

// Use login hook
export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      console.error("Login Error:", error);
    },
  });
};

// Use register hook
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      console.error("Registration Error:", error);
    },
  });
};

const logoutUser = () => {
  localStorage.removeItem("token"); // Remove the token from localStorage
  localStorage.removeItem("user"); // Remove the token from localStorage
};

export const useLogoutUser = () => {
  const navigate = useNavigate();

  return () => {
    logoutUser();
    navigate("/login"); // Redirect to login page after logout
  };
};
