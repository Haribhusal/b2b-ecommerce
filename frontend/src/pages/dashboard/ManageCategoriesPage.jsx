import React from "react";
import { Link } from "react-router-dom";
import { useCategories, useDeleteCategory } from "../../hooks/useCategories";
import { ImSpinner3 } from "react-icons/im";
import { MdCategory } from "react-icons/md";

import { FaPencilAlt, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const ManageCategoriesPage = () => {
  const { data: categories, error, isLoading, refetch } = useCategories();
  const {
    mutate: deleteCategory,
    isLoading: deleteLoading,
    error: deleteError,
  } = useDeleteCategory();

  const handleDelete = (categoryId) => {
    deleteCategory(categoryId, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        refetch(); // Refetch the categories list after deletion
      },
      onError: (error) => {
        toast.error(error.message || "An error occurred");
      },
    });
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message || "An error occurred"}</div>;

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Categories ({categories?.length})</h3>
        <Link to="/dashboard/add-category">
          <button className="btn btn-primary">Add New Category</button>
        </Link>
      </div>
      <section>
        <ul>
          {categories.map((category) => (
            <li
              key={category._id}
              className="bg-orange-50 group items-center mb-2 card p-3 rounded-md flex gap-3"
            >
              <div className="image">
                <MdCategory className="text-xl text-orange-400 shadow  w-8 h-8 p-1 rounded-md bg-white" />
              </div>
              <div className="info w-full">
                <h2 className="text-xl font-semibold text-gray-700">
                  {category.name}
                </h2>
              </div>
              <div className="flex gap-3 items-center">
                <Link to={`/dashboard/edit-categories/${category._id}`}>
                  <button className="h-8 w-8 shadow-2xl text-white bg-orange-600 rounded-full flex justify-center items-center">
                    <FaPencilAlt />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="h-8 w-8 shadow-2xl text-white bg-red-600 rounded-full flex justify-center items-center"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <ImSpinner3 className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {deleteError && <div className="error">Error: {deleteError.message}</div>}
    </div>
  );
};

export default ManageCategoriesPage;
