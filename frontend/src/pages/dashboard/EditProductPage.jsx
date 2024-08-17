import React from "react";
import ProductEditForm from "./../../components/dashboard/EditProductForm";
import { useParams } from "react-router-dom";
const EditProductPage = () => {
  const params = useParams();
  console.log(params);
  //   const { id } = useParams();
  return (
    <>
      <section className="p-5">
        <div className="heading title text-xl">Editing Product</div>
        <hr className="my-3" />

        <ProductEditForm id={params.productId} />
      </section>
    </>
  );
};

export default EditProductPage;
