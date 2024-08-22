import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAllTickets,
  // useTicketsByOrder,
  useAddMessageToTicket,
} from "../../hooks/useTickets";

const ManageTicketsPage = () => {
  const { orderId } = useParams();
  const { data: tickets, isLoading, error } = useAllTickets();
  const [message, setMessage] = useState("");
  const addMessage = useAddMessageToTicket();

  const handleAddMessage = async (ticketId) => {
    await addMessage(ticketId, message);
    setMessage("");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Tickets ({tickets?.length})</h3>
      </div>
      <h3>Tickets for Order {orderId}</h3>
      {tickets.map((ticket) => (
        <div key={ticket._id}>
          <h4>{ticket.subject}</h4>
          <p>Status: {ticket.status}</p>
          <div>
            {ticket.messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender.name}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={() => handleAddMessage(ticket._id)}>
            Send Message
          </button>
        </div>
      ))}
    </div>
  );
};

export default ManageTicketsPage;
