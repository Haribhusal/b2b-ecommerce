import React from "react";
import { useParams } from "react-router-dom";
import { useOrder } from "../../hooks/useOrders";
import Loader from "../../components/Loader";
import { formatDistanceToNow } from "date-fns";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { data: order, error, isLoading } = useOrder(id);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message || "An error occurred"}</div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl mb-2">Order ID: {order._id}</h3>
        <div className="mb-4">
          <strong>Status:</strong> {order.status}
        </div>
        <div className="mb-4">
          <strong>Payment Method:</strong> {order.paymentMethod}
        </div>
        <div className="mb-4">
          <strong>Total Items:</strong> {order.totalItems}
        </div>
        <div className="mb-4">
          <strong>Total Price:</strong> ${order.totalPrice}
        </div>
        <div className="mb-4">
          <strong>Order Date:</strong>{" "}
          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
        </div>
        {order.status !== "Pending" && (
          <div className="mb-4">
            <strong>Order Updated:</strong>{" "}
            {formatDistanceToNow(new Date(order.updatedAt), {
              addSuffix: true,
            })}
          </div>
        )}
        {order.isDelivered && (
          <div className="mb-4">
            <strong>Delivered At:</strong>{" "}
            {formatDistanceToNow(new Date(order.deliveredAt), {
              addSuffix: true,
            })}
          </div>
        )}
        <h3 className="text-xl mt-4 mb-2">Items:</h3>
        <ul>
          {order.items.map((item) => (
            <li key={item.product} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <strong>{item.name}</strong> x {item.quantity}
                </div>
                <div>${item.price * item.quantity}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
