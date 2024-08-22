import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTicketById, useAddMessageToTicket } from "../../hooks/useTickets";
import { ImSpinner3 } from "react-icons/im";
import Loader from "../../components/Loader";

const TicketDetailsPage = () => {
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
    <div className="p-5 relative">
      <h3 className="title text-xl mb-3">Ticket Details</h3>
      <div className="card flex-col items-start gap-1">
        <h4 className="font-bold">{ticket?.subject}</h4>
        <p className="tag">Status: {ticket.status}</p>
      </div>
      <div className="card flex-col items-start ">
        <h4 className="font-bold">Conversation</h4>
        {ticket.messages.map((msg, index) => (
          <div key={index} className="tag rounded-full">
            <strong>You</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="replyBox absolute bottom-0 mt-10 right-0  w-full px-5">
        <div className="flex gap-3 items-start w-full flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="textarea w-full"
          />
          <button
            className="btn btn-primary flex items-center gap-2 w-32"
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
      </div>
    </div>
  );
};

export default TicketDetailsPage;
