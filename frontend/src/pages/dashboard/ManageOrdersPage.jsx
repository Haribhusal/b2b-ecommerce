import React from "react";
import {
  useOrders,
  useDeleteOrder,
  useUpdateOrderStatus,
} from "../../hooks/useOrders";
import { Link } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { formatDistanceToNow } from "date-fns"; // Import from date-fns
import { TfiTicket } from "react-icons/tfi";
import { FiLoader } from "react-icons/fi";
import { IoIosTime, IoMdInformationCircle } from "react-icons/io";
import { formatPrice } from "../../utils/formatPrice";
import { BsStack } from "react-icons/bs";
import { MdPayments } from "react-icons/md";

const ManageOrdersPage = () => {
  const { data: orders, error, isLoading, refetch } = useOrders();
  const {
    mutate: deleteOrder,
    isLoading: deleteLoading,
    isError: deleteError,
    error: deleteErrorMessage,
  } = useDeleteOrder();

  const {
    mutate: updateOrderStatus,
    isPending: statusLoading,
    isError: statusError,
  } = useUpdateOrderStatus();

  const handleDelete = (orderId) => {
    deleteOrder(orderId, {
      onSuccess: () => {
        toast.success("Order deleted successfully");
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || "An error occurred");
      },
    });
  };

  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(
      { id: orderId, status },
      {
        onSuccess: () => {
          toast.success(`Order ${status.toLowerCase()} successfully`);
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "An error occurred");
        },
      }
    );
  };

  if (isLoading || statusLoading) return <Loader />;
  if (error) return <div>Error: {error.message || "An error occurred"}</div>;

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
                    <IoMdInformationCircle /> Rs.{formatPrice(order.totalPrice)}
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
                  {order.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Accepted")
                        }
                        className="btn btn-primary flex items-center gap-3"
                        disabled={statusLoading}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Rejected")
                        }
                        className="btn btn-bordered"
                        disabled={statusLoading}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {order.status === "Rejected" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Accepted")}
                      className="btn btn-primary flex items-center gap-3"
                      disabled={statusLoading}
                    >
                      Accept
                    </button>
                  )}

                  {order.status === "Accepted" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Rejected")}
                      className="btn btn-bordered"
                      disabled={statusLoading}
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="h-8 w-8 shadow-2xl text-white bg-red-600 rounded-full flex justify-center items-center"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <ImSpinner3 className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {deleteError && (
        <div className="error">
          Error: {deleteErrorMessage?.message || "An error occurred"}
        </div>
      )}
      {statusError && (
        <div className="error">
          Error: {statusError.message || "An error occurred"}
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;
