import React from "react";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../hooks/useOrders";
import Loader from "../../components/Loader";
import { formatDistanceToNow } from "date-fns";
import { formatPrice } from "../../utils/formatPrice";
import { IoIosPricetag } from "react-icons/io";
import { IoMdPricetag } from "react-icons/io";
import { FaAngleLeft, FaStackOverflow, FaWallet } from "react-icons/fa";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { data: order, error, isLoading } = useOrder(id);
  console.log(order);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message || "An error occurred"}</div>;

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Order Details </h3>
        <Link to="/dashboard/manage-orders">
          <button className="btn btn-primary flex gap-2 items-center">
            {" "}
            <FaAngleLeft /> All Orders
          </button>
        </Link>
      </div>
      <div className="shadow-lg shadow-orange-200 rounded-lg flex-col items-stretch p-5">
        <h3 className="text-xl mb-2">Order ID: {order._id}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="card p-3">
            <strong>Ordered by:</strong> {order.user.name}
          </div>
          <div className="card p-3">
            <strong>Status:</strong> {order.status}
          </div>
          <div className="card p-3">
            <strong>Payment Method:</strong> {order.paymentMethod}
          </div>
          <div className="card p-3">
            <strong>Total Items:</strong> {order.totalItems}
          </div>
          <div className="card p-3">
            <strong>Total Price:</strong> Rs. {formatPrice(order.totalPrice)}
          </div>

          <div className="card p-3">
            <strong>Ordered at:</strong>{" "}
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
            })}
          </div>
          {order.status !== "Pending" && (
            <div className="card p-3">
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
        </div>

        <h3 className="text-xl mt-4 mb-2">Items:</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {order.items.map((item) => (
            <li key={item.product} className="mb-2">
              <div className="flex card justify-between">
                <div className="left flex  gap-3">
                  <div className="image w-48">
                    <img className=" object-contain" src={item.images[0].url} />
                  </div>
                  <div>
                    <div>
                      <strong className="line-clamp-2">{item?.name}</strong>
                    </div>
                    <div className="flex gap-3 my-2">
                      <span className="tag">
                        <IoMdPricetag />
                        Rs. {formatPrice(item.price)}
                      </span>
                      <span className="tag">
                        <FaStackOverflow />
                        {item.quantity}
                      </span>
                      <span className="tag">
                        <FaWallet />
                        Rs. {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
