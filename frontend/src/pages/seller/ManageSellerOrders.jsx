import React from "react";
import { useSellerOrders } from "./../../hooks/useOrders";
import Loader from "./../../components/Loader";
import { TfiTicket } from "react-icons/tfi";
import { Link } from "react-router-dom";
import {
  IoIosTime,
  IoMdInformationCircle,
  IoMdPricetags,
} from "react-icons/io";
import { formatPrice } from "../../utils/formatPrice";
import { BsStack } from "react-icons/bs";
import { MdPayments } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";

const ManageSellerOrders = () => {
  const { data: orders, isLoading, error } = useSellerOrders();

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Orders ({orders?.length})</h3>
      </div>
      <section>
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="card">
              <div className="image">
                <TfiTicket className="text-xl text-orange-400 shadow w-12 h-12 p-2 rounded-md bg-white" />
              </div>
              <div className="info w-full">
                <h2 className="text-xl font-semibold text-gray-700">
                  <span className="capitalize">{order.user?.name} </span>
                  <span className="text-sm font-normal">
                    <Link to={`/dashboard/order-details/${order._id}`}>
                      #{order._id}
                    </Link>{" "}
                  </span>
                </h2>
                <div className="meta flex text-gray-600 gap-1 mb-1">
                  <div className="tag">
                    <IoMdInformationCircle /> {order.status}
                  </div>{" "}
                  <div className="tag">
                    <IoMdPricetags /> Rs.{formatPrice(order.totalPrice)}
                  </div>{" "}
                  <div className="tag">
                    <BsStack />
                    {order?.totalItems} items
                  </div>{" "}
                  <div className="tag capitalize">
                    <MdPayments />
                    {order?.paymentMethod}
                  </div>{" "}
                  <div className="tag">
                    <IoIosTime />
                    {formatDistanceToNow(new Date(order.createdAt))} ago
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex gap-2">
                  <Link to={`/seller/order-details/${order._id}`}>
                    <button className="btn btn-primary">View</button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ManageSellerOrders;
