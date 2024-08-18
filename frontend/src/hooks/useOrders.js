import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:5000/api";
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const handleErrorResponse = async (response) => {
  const errorData = await response.json();
  throw new Error(errorData.message || "An error occurred");
};

// Fetch all orders
const fetchOrders = async () => {
  const response = await fetch(`${BASE_URL}/orders`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch a single order by ID
const fetchOrderById = async (orderId) => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    staleTime: 1000 * 60 * 5,
    enabled: !!orderId,
  });
};

// Add a new order
const addOrder = async (newOrder) => {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(newOrder),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useAddOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
};

// Update an order by ID
const updateOrderById = async ({ id, ...orderData }) => {
  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderById,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      console.error("Error updating order:", error);
    },
  });
};

// Delete an order by ID
const deleteOrderById = async (orderId) => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete the order");
  }

  return response.json(); // Assuming your API returns a JSON response after deletion
};

export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: deleteOrderById,
  });
};
