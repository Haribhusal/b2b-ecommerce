import React from "react";
import {
  useOrders,
  useDeleteOrder,
  useUpdateOrderStatus,
} from "../../hooks/useOrders";
import { Link } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { FaShoppingCart } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns"; // Import from date-fns

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
    isLoading: statusLoading,
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

  if (isLoading) return <Loader />;
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
                <FaShoppingCart className="text-xl text-orange-400 shadow w-12 h-12 p-2 rounded-md bg-white" />
              </div>
              <div className="info w-full">
                <h2 className="text-xl font-semibold text-gray-700">
                  Order #
                  <Link to={`/dashboard/order-details/${order._id}`}>
                    {order._id}
                  </Link>
                </h2>
                <div className="meta flex text-gray-600 gap-1 mb-1">
                  <div className="status">Status: {order.status}</div> |
                  <div className="time">
                    {formatDistanceToNow(new Date(order.createdAt))} ago
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(order._id, "Accepted")}
                    className="btn btn-primary"
                    disabled={statusLoading}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(order._id, "Rejected")}
                    className="btn btn-bordered"
                    disabled={statusLoading}
                  >
                    Reject
                  </button>
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
