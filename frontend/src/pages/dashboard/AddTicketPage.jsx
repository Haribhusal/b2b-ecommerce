import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTicket } from "../../hooks/useTickets";

const AddTicketPage = ({ orderId }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const createTicket = useCreateTicket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTicket({ orderId, subject, message });
    navigate(`/orders/${orderId}/tickets`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Ticket</button>
    </form>
  );
};

export default AddTicketPage;
