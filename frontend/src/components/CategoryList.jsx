// src/components/CategoryList.js
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { useCategories } from "../hooks/useCategories";
import { MdCategory } from "react-icons/md";

const CategoryList = () => {
  const { data: categories, error, isLoading } = useCategories();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="px-5 md:px-10 py-5 bg-gray-100">
      <div className="heading text-slate-600 text-xl mb-3">
        Find products by Category
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-5">
        {categories.length > 0 &&
          categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center bg-white p-3 shadow-md gap-3 rounded-md"
            >
              <div className="icon">
                <MdCategory className="h-12 w-12 bg-gray-100 p-2 rounded-md text-orange-500" />
              </div>
              <h3 className="">{category.name}</h3>
            </div>
          ))}
      </div>
    </section>
  );
};

export default CategoryList;
