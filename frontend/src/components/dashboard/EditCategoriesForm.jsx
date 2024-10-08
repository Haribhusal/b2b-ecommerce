import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useUpdateCategory,
  useCategory,
  useCategories,
} from "../../hooks/useCategories";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Loader from "./../../components/Loader";

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  parent: Yup.string().nullable(), // Parent category is optional
});

const CategoryEditForm = ({ id }) => {
  const navigate = useNavigate();

  const {
    data: category,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useCategory(id);

  const { data: categories } = useCategories(); // Fetch all categories for parent dropdown

  const {
    mutate: updateCategory,
    isLoading: isUpdating,
    isError,
    error,
  } = useUpdateCategory();

  useEffect(() => {
    if (category) {
      formik.setValues({
        name: category.name,
        parent: category.parent?._id || "", // Set parent category if exists
      });
    }
  }, [category]);

  const formik = useFormik({
    initialValues: {
      name: "",
      parent: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateCategory(
        { id, ...values },
        {
          onSuccess: () => {
            toast.success("Category updated successfully");
            navigate("/dashboard/manage-categories");
          },
          onError: (error) => {
            toast.error(error.message || "An error occurred");
          },
        }
      );
    },
  });

  if (isCategoryLoading) return <Loader />;
  if (categoryError)
    return <div>Error: {categoryError.message || "An error occurred"}</div>;

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Category Name */}
      <div className="form-group">
        <label htmlFor="name">Category Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter category name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.errors.name && (
          <div className="error">{formik.errors.name}</div>
        )}
      </div>

      {/* Parent Category */}
      <div className="form-group">
        <label htmlFor="parent">Parent Category</label>
        <select
          id="parent"
          name="parent"
          onChange={formik.handleChange}
          value={formik.values.parent}
        >
          <option value="">Select Parent Category (Optional)</option>
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        className="btn btn-primary flex gap-3 items-center"
        type="submit"
        disabled={isUpdating}
      >
        {isUpdating ? "Updating Category..." : "Update Category"}
        {isUpdating && <ImSpinner3 className="animate-spin" />}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default CategoryEditForm;
