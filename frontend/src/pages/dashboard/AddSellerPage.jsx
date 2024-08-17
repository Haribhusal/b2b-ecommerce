import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddSeller } from "../../hooks/useSeller"; // Custom hook to add a seller
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  role: Yup.string()
    .oneOf(["seller", "admin"], "Invalid role")
    .required("Role is required"),
  isVerified: Yup.boolean(),
  isApproved: Yup.boolean(),
});

const AddSellerPage = () => {
  const navigate = useNavigate();
  const { mutate: addSeller, isLoading, isError, error } = useAddSeller();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "seller", // Default role
      isVerified: false,
      isApproved: false,
    },
    validationSchema,
    onSubmit: (values) => {
      addSeller(values, {
        onSuccess: () => {
          toast.success("Seller added successfully");
          navigate("/dashboard/manage-sellers");
        },
        onError: (error) => {
          toast.error(error.message || "An error occurred");
        },
      });
    },
  });

  return (
    <div className="p-5">
      <div className="heading title text-xl">Add New Seller</div>
      <hr className="my-3" />
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter seller's name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && (
            <div className="error">{formik.errors.name}</div>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter seller's email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>

        {/* Verified */}
        <div className="form-group">
          <label htmlFor="isVerified">Verified</label>
          <input
            id="isVerified"
            name="isVerified"
            type="checkbox"
            onChange={formik.handleChange}
            checked={formik.values.isVerified}
          />
        </div>

        {/* Approved */}
        <div className="form-group">
          <label htmlFor="isApproved">Approved</label>
          <input
            id="isApproved"
            name="isApproved"
            type="checkbox"
            onChange={formik.handleChange}
            checked={formik.values.isApproved}
          />
        </div>

        {/* Submit Button */}
        <button
          className="btn btn-primary flex gap-3 items-center"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Adding Seller..." : "Add Seller"}{" "}
          {isLoading && <ImSpinner3 className="animate-spin" />}
        </button>

        {isError && <div className="error">Error: {error.message}</div>}
      </form>
    </div>
  );
};

export default AddSellerPage;
