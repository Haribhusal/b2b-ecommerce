import React from "react";
import { useSellers, useDeleteSeller } from "../../hooks/useSeller";
import { Link } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { FaUserTie } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { FcDisapprove } from "react-icons/fc";

const ManageSellersPage = () => {
  const { data: sellers, error, isLoading, refetch } = useSellers();
  console.log(sellers);
  const {
    mutate: deleteSeller,
    isLoading: deleteLoading,
    isError: deleteError,
    error: deleteErrorMessage,
  } = useDeleteSeller();

  const handleDelete = (sellerId) => {
    deleteSeller(sellerId, {
      onSuccess: () => {
        toast.success("Seller deleted successfully");
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || "An error occurred");
      },
    });
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message || "An error occurred"}</div>;

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Sellers ({sellers?.length})</h3>
        <Link to="/dashboard/add-seller">
          <button className="btn btn-primary">Add New Seller</button>
        </Link>
      </div>
      <section>
        <ul>
          {sellers.map((seller) => (
            <li key={seller._id} className="card">
              <div className="image">
                <FaUserTie className="text-xl text-orange-400 shadow  w-12 h-12 p-2 rounded-md bg-white" />
              </div>
              <div className="info w-full">
                <h2 className="text-xl font-semibold text-gray-700">
                  <Link to={`/dashboard/edit-seller/${seller._id}`}>
                    {seller.name}
                  </Link>
                </h2>
                <div className="meta flex text-gray-600 gap-1 mb-1">
                  <div className="tag">
                    <MdEmail />
                    {seller.email}
                  </div>{" "}
                  <div className="tag">
                    <FaAddressCard />
                    {seller.role}
                  </div>
                  <div className="stat">
                    {seller.isVerified ? (
                      <div className="tag">
                        <FcApproval />
                        Verified
                      </div>
                    ) : (
                      <div className="tag">
                        <FcDisapprove />
                        Not Verified
                      </div>
                    )}
                  </div>
                  <div className="stat">
                    {seller.isApproved ? (
                      <div className="tag">
                        <FcApproval />
                        Approved
                      </div>
                    ) : (
                      <div className="tag">
                        <FcDisapprove />
                        Not Approved
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Link to={`/dashboard/edit-seller/${seller._id}`}>
                  <button className="h-8 w-8 shadow-2xl text-white bg-orange-600 rounded-full flex justify-center items-center">
                    <FaPencilAlt />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(seller._id)}
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
            </li>
          ))}
        </ul>
      </section>
      {deleteError && (
        <div className="error">
          Error: {deleteErrorMessage?.message || "An error occurred"}
        </div>
      )}
    </div>
  );
};

export default ManageSellersPage;
