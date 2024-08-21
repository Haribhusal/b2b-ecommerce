import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddCategory, useCategories } from "../../hooks/useCategories";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  parent: Yup.string().nullable(),
});

const AddCategoryForm = () => {
  const navigate = useNavigate();
  const { data: categories } = useCategories(); // Fetch categories for the parent dropdown
  const {
    mutate: addCategory,
    isLoading: isAdding,
    isError,
    error,
  } = useAddCategory();

  const formik = useFormik({
    initialValues: {
      name: "",
      parent: "",
    },
    validationSchema,
    onSubmit: (values) => {
      addCategory(values, {
        onSuccess: () => {
          toast.success("Category added successfully");
          navigate("/dashboard/manage-categories");
        },
        onError: (error) => {
          toast.error(error.message || "An error occurred");
        },
      });
    },
  });

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
        disabled={isAdding}
      >
        {isAdding ? "Adding Category..." : "Add Category"}
        {isAdding && <ImSpinner3 className="animate-spin" />}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default AddCategoryForm;
