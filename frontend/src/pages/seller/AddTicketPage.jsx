import React from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useSellerOrders } from "../../hooks/useOrders"; // Import the hook
import Loader from "../../components/Loader";
import { useCreateTicket } from "../../hooks/useTickets";
import { toast } from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

// Hook to create a ticket

const validationSchema = Yup.object({
  orderId: Yup.string().required("Order is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

const CreateTicket = () => {
  const navigate = useNavigate();
  const { data: orders } = useSellerOrders(); // Fetch orders for the order dropdown
  console.log("orders", orders);
  const {
    mutate: addTicket,
    isLoading: isAdding,
    isError,
    error,
  } = useCreateTicket();

  const formik = useFormik({
    initialValues: {
      orderId: "",
      subject: "",
      message: "",
    },
    validationSchema,
    onSubmit: (values) => {
      addTicket(values, {
        onSuccess: () => {
          toast.success("Ticket created successfully");
          navigate("/seller/manage-tickets");
        },
        onError: (error) => {
          toast.error(error.message || "An error occurred");
        },
      });
    },
  });

  if (isAdding) return <Loader />;
  return (
    <div className="wrap p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Create New Ticket </h3>
        <Link to="/seller/manage-tickets">
          <button className="btn btn-primary">All Tickets</button>
        </Link>
      </div>
      <form onSubmit={formik.handleSubmit}>
        {/* Order Selection */}
        <div className="form-group">
          <label htmlFor="orderId">Order</label>
          <select
            id="orderId"
            name="orderId"
            onChange={formik.handleChange}
            value={formik.values.orderId}
          >
            <option value="">Select Order</option>
            {orders?.map((order) => (
              <option key={order._id} value={order._id}>
                {order.items.map((item) => (
                  <span className="" key={item._id}>
                    {item.name} X {item.quantity}
                  </span>
                ))}
              </option>
            ))}
          </select>
          {formik.errors.orderId && (
            <div className="error">{formik.errors.orderId}</div>
          )}
        </div>

        {/* Subject */}
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Enter subject"
            onChange={formik.handleChange}
            value={formik.values.subject}
          />
          {formik.errors.subject && (
            <div className="error">{formik.errors.subject}</div>
          )}
        </div>

        {/* Message */}
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            onChange={formik.handleChange}
            value={formik.values.message}
          />
          {formik.errors.message && (
            <div className="error">{formik.errors.message}</div>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="btn btn-primary flex gap-3 items-center"
          type="submit"
          disabled={isAdding}
        >
          {isAdding ? "Creating Ticket..." : "Create Ticket"}
          {isAdding && <ImSpinner3 className="animate-spin" />}
        </button>

        {isError && <div className="error">Error: {error.message}</div>}
      </form>
    </div>
  );
};

export default CreateTicket;
