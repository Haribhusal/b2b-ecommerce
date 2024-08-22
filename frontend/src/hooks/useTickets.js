import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const handleErrorResponse = async (response) => {
  const errorData = await response.json();
  throw new Error(errorData.message || "An error occurred");
};

// Fetch all tickets from the backend
const fetchAllTickets = async () => {
  const response = await fetch(`${BASE_URL}/tickets`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

// Hook to use in your components
export const useAllTickets = () => {
  return useQuery({
    queryKey: ["allTickets"],
    queryFn: fetchAllTickets,
    staleTime: 1000 * 60 * 10, // Data is fresh for 10 minutes
    cacheTime: 1000 * 60 * 30, // Cached for 30 minutes
    retry: 1, // Retry once on failure
  });
};

// create tickets
const createTicket = async (newTicket) => {
  const response = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(newTicket),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]); // Invalidate tickets query after a successful mutation
    },
    onError: (error) => {
      console.error("Error creating ticket:", error);
    },
  });
};

// fetch tickets by order
const fetchTicketsByOrder = async (orderId) => {
  const response = await fetch(`${BASE_URL}/tickets/order/${orderId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useTicketsByOrder = (orderId) => {
  return useQuery({
    queryKey: ["tickets", orderId],
    queryFn: () => fetchTicketsByOrder(orderId),
    staleTime: 1000 * 60 * 10, // Data is fresh for 10 minutes
    cacheTime: 1000 * 60 * 30, // Cached for 30 minutes
    enabled: !!orderId, // Fetch only if orderId is available
    retry: 1,
  });
};

const addMessageToTicket = async ({ id, message }) => {
  console.log("received to backend", id, message);
  const response = await fetch(`${BASE_URL}/tickets/${id}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useAddMessageToTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMessageToTicket,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["ticket", variables.ticketId]); // Invalidate the specific ticket query
    },
    onError: (error) => {
      console.error("Error adding message:", error);
    },
  });
};

// update ticket status
const updateTicketStatus = async ({ ticketId, status }) => {
  const response = await fetch(`${BASE_URL}/tickets/${ticketId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
  return response.json();
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTicketStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tickets", variables.ticketId]); // Invalidate the specific ticket query
    },
    onError: (error) => {
      console.error("Error updating ticket status:", error);
    },
  });
};

const fetchTicketById = async (ticketId) => {
  const response = await fetch(`${BASE_URL}/tickets/${ticketId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error fetching ticket details");
  }

  return response.json();
};

export const useTicketById = (ticketId) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => fetchTicketById(ticketId),
    enabled: !!ticketId, // Only run the query if ticketId is available
    staleTime: 1000 * 60 * 10, // Data is fresh for 10 minutes
    cacheTime: 1000 * 60 * 30, // Cached for 30 minutes
    retry: 1, // Retry once on failure
  });
};
