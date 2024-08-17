// src/components/ProductDetail.js
import React from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { ImSpinner3 } from "react-icons/im";
import Loader from "./Loader";

const ProductDetail = () => {
  const { productId } = useParams();
  const { data: product, error, isLoading } = useProduct(productId);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <section className="px-5 md:px-10 py-3 md:py-5">
      <h2 className="text-3xl title">{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <img src={product.imageUrl} alt={product.name} />
    </section>
  );
};

export default ProductDetail;
