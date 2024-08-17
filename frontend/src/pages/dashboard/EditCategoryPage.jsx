import React from "react";
import CategoryEditForm from "./../../components/dashboard/EditCategoriesForm";
import { useParams } from "react-router-dom";
const EditCategoryPage = () => {
  const params = useParams();
  console.log(params);
  //   const { id } = useParams();
  return (
    <>
      <section className="p-5">
        <div className="heading title text-xl">Editing Product</div>
        <hr className="my-3" />

        <CategoryEditForm id={params.categoryId} />
      </section>
    </>
  );
};

export default EditCategoryPage;
