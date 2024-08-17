import React from "react";
import AddCategoryForm from "./../../components/dashboard/AddCategoryForm";
const AddCategoryPage = () => {
  return (
    <>
      <section className="p-5">
        <div className="heading title text-xl">Adding Category</div>
        <hr className="my-3" />
        <AddCategoryForm />
      </section>
    </>
  );
};

export default AddCategoryPage;
