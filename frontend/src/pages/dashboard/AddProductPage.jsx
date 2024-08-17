import React from "react";
import ProductAddForm from "./../../components/dashboard/AddProductForm";
const AddProductPage = () => {
  return (
    <>
      <section className="p-5">
        <div className="heading title text-xl">Adding Product</div>
        <hr className="my-3" />
        <ProductAddForm />
      </section>
    </>
  );
};

export default AddProductPage;
