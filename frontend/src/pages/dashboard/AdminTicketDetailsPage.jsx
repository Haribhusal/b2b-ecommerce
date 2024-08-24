import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useTicketById, useAddMessageToTicket } from "../../hooks/useTickets";
import { ImSpinner3 } from "react-icons/im";
import Loader from "../../components/Loader";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client"; // Import socket.io-client
const socket = io("http://localhost:5000"); // Connect to the Socket.IO server
const AdminTicketDetailsPage = () => {
  const { id } = useParams();
  const { data: ticket, isLoading, error, refetch } = useTicketById(id);
  console.log("ticket", ticket);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-5 relative">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">{ticket?.subject}</h3>
        <div className="flex gap-3">
          <span className="tag">Status: {ticket.status}</span>
          <span className="tag">Order ID: {ticket.orderId._id}</span>
          <Link to="/dashboard/manage-tickets">
            <button className="btn btn-primary">Back</button>
          </Link>
        </div>
      </div>
      <div className="orders flex gap-3 mb-3">
        <div className="span">Products ordered</div>
        {ticket.orderId.items.slice(0, 3).map((item) => (
          <span key={item._id} className="tag">
            {item.name.slice(0, 20)} X {item.quantity}
          </span>
        ))}
      </div>
      <div className="flex-col items-stretch gap-1 mb-5 p-0">
        <h4 className="font-bold mb-2 bg-orange-100 text-orange-500 text-xl p-3 rounded-tl-md rounded-tr-md">
          Conversation
        </h4>
        <div
          ref={scrollRef}
          className="conversation-box p-3 flex flex-col gap-2 h-96 overflow-y-scroll"
        >
          {ticket.messages.map((msg, index) => (
            <div
              key={index}
              className={`relative group w-3/4 px-4 py-1 rounded-2xl
                ${
                  msg.sender.role === "admin"
                    ? "ml-auto bg-orange-100 border-[1px] border-orange-200"
                    : "mr-auto bg-white border-[1px] border-gray-300"
                }`}
            >
              {msg.message}
              <span
                className={`absolute hidden group-hover:block  right-2 top-1/2 -translate-y-1/2 text-sm rounded-full  ${
                  msg.sender.role === "admin" ? "" : ""
                }`}
              >
                {formatDistanceToNow(new Date(msg.timestamp))} ago
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="replyBox fixed bg-white p-3  right-0 bottom-0 w-full md:w-3/4 px-5">
        <div className="flex gap-3 items-start w-full flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="textarea w-full mb-3"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddMessage();
              }
            }}
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

export default AdminTicketDetailsPage;
