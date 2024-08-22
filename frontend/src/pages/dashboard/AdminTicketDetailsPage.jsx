import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTicketById, useAddMessageToTicket } from "../../hooks/useTickets";
import { ImSpinner3 } from "react-icons/im";
import Loader from "../../components/Loader";

const AdminTicketDetailsPage = () => {
  const { id } = useParams();
  const { data: ticket, isLoading, error } = useTicketById(id);
  const [message, setMessage] = useState("");
  const { mutate: addMessage, isLoading: isAddingMessage } =
    useAddMessageToTicket();

  const handleAddMessage = () => {
    if (message.trim()) {
      addMessage(
        { id, message },
        {
          onSuccess: () => setMessage(""),
        }
      );
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-5">
      <h3 className="title text-xl mb-3">Admin Ticket Details</h3>
      <div className="card flex-col items-start gap-1">
        <h4 className="font-bold">{ticket?.subject}</h4>
        <p className="tag">Status: {ticket.status}</p>
        <p className="tag">Order ID: {ticket.orderId}</p>
      </div>
      <div className="card">
        <h4 className="font-bold mb-2">Conversation</h4>
        {ticket.messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
        className="textarea w-full mb-3"
      />
      <button
        className="btn btn-primary flex items-center gap-2"
        onClick={handleAddMessage}
        disabled={isAddingMessage}
      >
        {isAddingMessage ? (
          <>
            Sending... <ImSpinner3 className="animate-spin" />
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </div>
  );
};

export default AdminTicketDetailsPage;
