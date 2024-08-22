import React from "react";
import { Link } from "react-router-dom";
import { useAllTickets } from "../../hooks/useTickets";
import Loader from "../../components/Loader";

const ManageAdminTicketsPage = () => {
  const { data: tickets, isLoading, error } = useAllTickets();

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Admin Tickets ({tickets?.length})</h3>
      </div>
      {tickets.map((ticket) => (
        <div key={ticket._id} className="card justify-between">
          <div className="info">
            <h4 className="font-bold mb-1">{ticket.subject}</h4>
            <div className="meta flex gap-3 text-sm">
              <span className="tag">Status: {ticket.status}</span>
              <span className="tag">Order ID: {ticket.orderId}</span>
            </div>
          </div>
          <Link to={`/dashboard/view-ticket/${ticket._id}`}>
            <button className="btn btn-bordered mt-2 md:mt-0">
              View Ticket
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ManageAdminTicketsPage;
