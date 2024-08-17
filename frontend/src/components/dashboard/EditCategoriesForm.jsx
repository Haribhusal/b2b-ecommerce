import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateCategory, useCategory } from "../../hooks/useCategories";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Loader from "./../../components/Loader";

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
});

const CategoryEditForm = ({ id }) => {
  const navigate = useNavigate();

  const {
    data: category,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useCategory(id);
  const {
    mutate: updateCategory,
    isLoading: isUpdating,
    isError,
    error,
  } = useUpdateCategory();

  useEffect(() => {
    if (category) {
      formik.setValues({ name: category.name });
    }
  }, [category]);

  const formik = useFormik({
    initialValues: { name: "" },
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
