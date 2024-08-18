// src/components/ProductsList.js
import React from "react";
import { useProducts } from "../hooks/useProducts";
import { ImSpinner3 } from "react-icons/im";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { addToCart } from "./../features/cartSlice";
import { useDispatch } from "react-redux";
import { formatPrice } from "./../utils/formatPrice";

const ProductsList = () => {
  const dispatch = useDispatch();
  const { data: products, error, isLoading } = useProducts();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="px-5 md:px-10 py-5">
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
        {products.map((product) => (
          <li
            key={product._id}
            className="bg-white border-r-2 border-orange-500 relative shadow-md hover:shadow-lg transition-all p-5 rounded-md flex gap-3"
          >
            <div className="ribbon absolute right-0 top-0 text-sm rounded-bl-md  rounded-tr-md text-white bg-orange-500 px-3">
              {product.discountType === "percentage"
                ? `${product.discountValue}% off`
                : `Rs. ${product.discountValue} off`}
            </div>
            <div className="image w-32">
              <img
                src="https://picsum.photos/id/34/100/100"
                className="rounded-md object-cover"
                alt=""
              />
            </div>
            <div className="info w-full">
              <h2 className="text-xl font-semibold text-gray-700">
                <Link to={`/products/${product._id}`}>{product.name}</Link>
              </h2>
              <div className="meta flex text-sm leading-normal   text-gray-600  gap-1 my-1">
                <div className="price flex gap-1">
                  Rs. {formatPrice(product.finalPrice)}
                  <span className="line-through bg-gray-100 px-2 rounded-sm">
                    Rs. {formatPrice(product.price)}
                  </span>
                </div>
                <div className="">({product.quantity} in Stock)</div>
              </div>
              <div className="action flex gap-3">
                <button
                  className="btn btn-primary"
                  onClick={() => dispatch(addToCart(product))}
                >
                  Add to cart
                </button>
                <Link to={`/products/${product._id}`}>
                  <button className="btn btn-bordered">Read More</button>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductsList;
