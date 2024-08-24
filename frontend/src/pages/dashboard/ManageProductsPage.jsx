// src/pages/dashboard/ManageProductsPage.jsx
import React from "react";
import { useProducts, useDeleteProduct } from "../../hooks/useProducts";
import { Link } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { AiFillProduct } from "react-icons/ai";
import Loader from "./../../components/Loader";
import { formatPrice } from "./../../utils/formatPrice";
import { IoMdPricetag } from "react-icons/io";
import { RiDiscountPercentLine } from "react-icons/ri";
import { AiOutlineStock } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import { FaBuildingWheat } from "react-icons/fa6";
import { BsStack } from "react-icons/bs";

const ManageProductsPage = () => {
  const { data: products, isLoading, error, refetch } = useProducts(); // Include refetch function
  // console.log(products);
  const {
    mutate: deleteProduct,
    isPending: deleteLoading,
    isError: deleteError,
    error: deleteErrorMessage,
  } = useDeleteProduct();

  const handleDelete = (productId) => {
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

  if (isLoading || deleteLoading) {
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
              className="card"
            >
              <div className="image">
                <img
                  className="w-16 h-16 object-contain"
                  src={product.images[0].url}
                />
                {/* <AiFillProduct className="text-xl text-orange-400 shadow  w-12 h-12 p-2 rounded-md bg-white" /> */}
              </div>
              <div className="info w-full">
                <h2 className="text-xl line-clamp-1 font-semibold text-gray-700">
                  {product.name}
                </h2>
                <div className="meta flex gap-2 text-gray-600 mb-1 ">
                  <div className="tag">
                    <IoMdPricetag />
                    Rs. {formatPrice(product.finalPrice)}
                  </div>{" "}
                  <div className="tag ">
                    <RiDiscountPercentLine />
                    {product.discountType === "percentage"
                      ? `${product.discountValue}% off`
                      : `Rs. ${product.discountValue} off`}
                  </div>
                  <div className="tag">
                    <IoMdPricetag />
                    <span className="line-through">
                      Rs. {formatPrice(product.price)}
                    </span>
                  </div>{" "}
                  <div className="tag">
                    <AiOutlineStock />
                    {product?.quantity} items in Stock
                  </div>
                  <div className="tag">
                    <BsStack />
                    {product.minimumOrder} min. order
                  </div>
                  <div className="tag">
                    <MdCategory />
                    {product.category?.name}
                  </div>
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
                  <FaTrash />
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
