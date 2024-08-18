import React from "react";
import ProductsList from "../components/ProductsList";

const ProductsPage = () => {
  return (
    <>
      <section>
        <div className="">
          <div className="page-heading  shadow-inner bg-white px-3  md:px-10 py-2">
            <h3 className="text-xl  text-orange-500">Products</h3>
          </div>
          <ProductsList />
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
