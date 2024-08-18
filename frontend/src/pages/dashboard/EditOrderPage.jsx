import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder, useUpdateOrder } from "../../hooks/useOrders";

const EditOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useOrder(orderId);
  const updateOrderMutation = useUpdateOrder();

  const [orderData, setOrderData] = useState({
    totalItems: "",
    totalPrice: "",
    paymentMethod: "",
    status: "",
  });

  useEffect(() => {
    if (order) {
      setOrderData({
        totalItems: order.totalItems,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        status: order.status,
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrderMutation.mutateAsync({ id: orderId, ...orderData });
      navigate("/orders");
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Edit Order</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Total Items</label>
          <input
            type="number"
            name="totalItems"
            value={orderData.totalItems}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Total Price</label>
          <input
            type="number"
            name="totalPrice"
            value={orderData.totalPrice}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Payment Method</label>
          <input
            type="text"
            name="paymentMethod"
            value={orderData.paymentMethod}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Status</label>
          <input
            type="text"
            name="status"
            value={orderData.status}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Order</button>
      </form>
    </div>
  );
};

export default EditOrderPage;
