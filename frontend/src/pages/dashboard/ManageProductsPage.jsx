// src/pages/dashboard/ManageProductsPage.jsx
import React from "react";
import { useProducts } from "../../hooks/useProducts";
import { Link } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import toast from "react-hot-toast";
import { AiFillProduct } from "react-icons/ai";
import Loader from "./../../components/Loader";

const ManageProductsPage = () => {
  const { data: products, error, isLoading, refetch } = useProducts(); // Include refetch function

  const {
    mutate: deleteProduct,
    isLoading: deleteLoading,
    isError: deleteError,
    error: deleteErrorMessage,
  } = useDeleteProduct();

  const handleDelete = (productId) => {
    console.log("Deleting product with ID:", productId);
    deleteProduct(productId, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        refetch(); // Refetch the product list after successful deletion
      },
      onError: (error) => {
        toast.error(error.message || "An error occurred");
      },
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message || "An error occurred"}</div>;
  }

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Products ({products?.length})</h3>
        <Link to="/dashboard/add-product">
          <button className="btn btn-primary">Add New Product</button>
        </Link>
      </div>
      <section>
        <ul>
          {products.map((product) => (
            <li
              key={product._id} // Use product._id
              className="bg-orange-50 group items-center mb-2 card p-3 rounded-md flex gap-3"
            >
              <div className="image">
                <AiFillProduct className="text-xl text-orange-400 shadow  w-12 h-12 p-2 rounded-md bg-white" />
              </div>
              <div className="info w-full">
                <h2 className="text-xl font-semibold text-gray-700">
                  {product.name}
                </h2>
                <div className="meta flex text-gray-600 gap-1 mb-1">
                  <div className="price">Rs. {product.price}</div> |
                  <div className="stock">
                    {product?.quantity} items in Stock
                  </div>
                  |<div className="stock">{product.company?.name} </div> |
                  <div className="stock">{product.category?.name} </div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Link to={`/dashboard/edit-product/${product._id}`}>
                  <button className="h-8 w-8 shadow-2xl text-white bg-orange-600 rounded-full flex justify-center items-center">
                    <FaPencilAlt />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
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

export default ManageProductsPage;
