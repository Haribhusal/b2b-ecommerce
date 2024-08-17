// src/components/ProductsList.js
import React from "react";
import { useProducts } from "../hooks/useProducts";
import { ImSpinner3 } from "react-icons/im";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const ProductsList = () => {
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
            key={product.id}
            className="bg-orange-50 card p-5 rounded-md flex gap-3"
          >
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
              <div className="meta flex  text-gray-600  gap-1 mb-1">
                <div className="price">Rs. {product.price}</div> -
                <div className="stock">{product.quantity} items in Stock</div>
              </div>
              <div className="action flex gap-3">
                <button className="btn btn-primary">Add to cart</button>
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
