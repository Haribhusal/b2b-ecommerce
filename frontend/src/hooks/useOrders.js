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
    staleTime: 1000 * 60 * 10, // Extended staleTime to reduce frequent refetching
    cacheTime: 1000 * 60 * 30, // Cached for 30 minutes
    retry: 1, // Retry failed requests once
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
    staleTime: 1000 * 60 * 10, // Extended staleTime for individual order
    cacheTime: 1000 * 60 * 30,
    enabled: !!orderId, // Fetch only if orderId is available
    retry: 1,
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
      queryClient.invalidateQueries(["orders"]); // Invalidate the orders query after a successful mutation
    },
    onError: (error) => {
      console.error("Error creating order:", error);
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
      queryClient.invalidateQueries(["order"]);
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
    await handleErrorResponse(response);
  }

  return response.json(); // Assuming your API returns a JSON response after deletion
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrderById,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
    },
  });
};

// Update an order by ID, including status
const updateOrderStatus = async ({ id, ...orderData }) => {
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

// Usage example to update status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      console.error("Error updating order:", error);
    },
  });
};
const fetchSellerOrders = async () => {
  const response = await fetch(`${BASE_URL}/orders/seller`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text(); // Get error details from response
    throw new Error(`Failed to fetch orders: ${errorDetails}`);
  }

  return response.json();
};

export const useSellerOrders = () => {
  return useQuery({
    queryKey: ["sellerOrders"],
    queryFn: fetchSellerOrders,
    staleTime: 1000 * 60 * 10, // Data is fresh for 10 minutes
    cacheTime: 1000 * 60 * 30, // Cached for 30 minutes
    retry: 1, // Retry once on failure
  });
};
