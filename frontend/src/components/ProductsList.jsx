// src/components/ProductsList.js
import React from "react";
import { useProducts } from "../hooks/useProducts";
import Loader from "./Loader";
import Product from "./../components/Product";

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
      <div className="heading text-slate-600 text-xl mb-3">Find products</div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </ul>
    </section>
  );
};

export default ProductsList;
