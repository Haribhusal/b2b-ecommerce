import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTicketById, useAddMessageToTicket } from "../../hooks/useTickets";
import { ImSpinner3 } from "react-icons/im";
import Loader from "../../components/Loader";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const TicketDetailsPage = () => {
  const { id } = useParams();
  const { data: ticket, isLoading, error, refetch } = useTicketById(id);
  const [message, setMessage] = useState("");
  const { mutate: addMessage, isLoading: isAddingMessage } =
    useAddMessageToTicket();
  const scrollRef = useRef(null);

  // Function to handle adding messages
  const handleAddMessage = useCallback(() => {
    if (message.trim()) {
      addMessage(
        { ticketId: id, message },
        {
          onSuccess: () => {
            setMessage(""); // Clear the input field on success
            socket.emit("sendMessage", id, message); // Emit message to socket
          },
        }
      );
    }
  }, [message, id, addMessage]);

  // Effect to listen for new messages from the socket
  useEffect(() => {
    const messageHandler = (newMessage) => {
      refetch(); // Refetch the ticket data to get the latest messages
    };

    socket.on(`messageReceived:${id}`, messageHandler);

    return () => {
      socket.off(`messageReceived:${id}`, messageHandler); // Clean up the listener on component unmount
    };
  }, [id, refetch]);

  // Effect to scroll to the bottom when the conversation updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages]);

  if (isLoading) return <Loader />; // Show loader while the ticket details are being fetched
  if (error) return <div>Error: {error.message}</div>; // Show error if something goes wrong

  return (
    <div className="p-5 relative">
      <h3 className="title text-xl mb-3">Ticket Details</h3>
      <div className="bg-orange-500 mb-5 text-white  px-5 py-2 items-center rounded-md flex justify-between gap-1">
        <h4 className="text-xl">{ticket?.subject}</h4>
        <p className="bg-white px-3 py-1 text-orange-500 rounded-md">
          Status: {ticket?.status}
        </p>
      </div>
      <div className="flex-col items-start relative rounded-md bg-orange-50">
        <h4 className="font-bold text-orange-500 sticky p-3 z-40 top-0 left-0 right-0 w-full bg-orange-100">
          Conversation
        </h4>
        <div
          ref={scrollRef}
          className="p-3 flex flex-col gap-2 h-[60vh] overflow-y-scroll"
        >
          {ticket?.messages.map((msg, index) => (
            <Message key={index} msg={msg} />
          ))}
        </div>
      </div>
      <div className="replyBox fixed bg-white p-3 bottom-3 mt-10 right-0 w-full md:w-3/4 px-5">
        <div className="flex gap-3 items-start w-full flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="textarea w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddMessage();
              }
            }}
            rows={1}
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

// Separate Message Component for better readability
const Message = ({ msg }) => {
  return (
    <div
      className={`relative rounded-md border-l-2 shadow-sm shadow-orange-200 px-3 py-1 w-3/4 
        ${
          msg.sender.role === "admin"
            ? "mr-auto bg-white border-orange-500"
            : "ml-auto bg-gray-800 border-white text-white"
        }`}
    >
      <strong>
        {msg.sender.name} ({msg.sender.role})
      </strong>
      : {msg.message}
      <span
        className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm rounded-full
          ${msg.sender.role === "admin" ? "" : "text-white"}`}
      >
        {formatDistanceToNow(new Date(msg.timestamp))} ago
      </span>
    </div>
  );
};

export default TicketDetailsPage;
