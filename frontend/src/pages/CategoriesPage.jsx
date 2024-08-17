import React from "react";
import CategoriesList from "../components/CategoriesList";

const CategoriesPage = () => {
  return (
    <>
      <section>
        <div className="">
          <div className="page-heading bg-orange-50 px-3  md:px-10 py-2">
            <h3 className="text-xl  text-orange-500">Categories</h3>
          </div>
          <CategoriesList />
        </div>
      </section>
    </>
  );
};

export default CategoriesPage;
