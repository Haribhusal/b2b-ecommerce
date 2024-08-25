import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api/sellers";

// Utility function to get headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
});

// Handle errors from API responses
const handleErrorResponse = async (response) => {
  const errorData = await response.json();
  throw new Error(errorData.message || "An error occurred");
};

// API call to login user
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

// API call to register user
const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
};

// API call to change password
const changePassword = async (passwordData) => {
  const response = await fetch(`${BASE_URL}/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
};

// API call to reset password
const resetPassword = async ({ token, password }) => {
  const response = await fetch(`${BASE_URL}/reset-password/${token}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
};

// API call to request a password reset
const forgotPassword = async (emailData) => {
  const response = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
};

// Custom hooks for authentication actions
export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      console.error("Login Error:", error);
    },
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      console.error("Registration Error:", error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      console.error("Change Password Error:", error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onError: (error) => {
      console.error("Reset Password Error:", error);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      console.error("Forgot Password Error:", error);
    },
  });
};

// Logout user function
const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Custom hook for logout action
export const useLogoutUser = () => {
  const navigate = useNavigate();

  return () => {
    logoutUser();
    navigate("/login"); // Redirect to login page after logout
  };
};

// Change Password
