import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateSeller, useSeller } from "../../hooks/useSeller";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  role: Yup.string()
    .oneOf(["seller", "admin"], "Invalid role")
    .required("Role is required"),
  isVerified: Yup.boolean(),
  isApproved: Yup.boolean(),
});

const EditSellerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: seller,
    isLoading: isSellerLoading,
    error: sellerError,
  } = useSeller(id);
  const {
    mutate: updateSeller,
    isLoading: isUpdating,
    isError,
    error,
  } = useUpdateSeller();

  useEffect(() => {
    if (seller) {
      formik.setValues({
        name: seller.name,
        email: seller.email,
        role: seller.role,
        isVerified: seller.isVerified,
        isApproved: seller.isApproved,
      });
    }
  }, [seller]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "seller",
      isVerified: false,
      isApproved: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateSeller(
        { id, ...values },
        {
          onSuccess: () => {
            toast.success("Seller updated successfully");
            navigate("/dashboard/manage-sellers");
          },
          onError: (error) => {
            toast.error(error.message || "An error occurred");
          },
        }
      );
    },
  });

  if (isSellerLoading) return <Loader />;
  if (sellerError)
    return <div>Error loading seller: {sellerError.message}</div>;

  return (
    <div className="p-5">
      <div className="heading title text-xl">Edit Seller</div>
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

        {/* Verified */}
        <div className="flex items-start gap-1">
          <input
            id="isVerified"
            name="isVerified"
            type="checkbox"
            onChange={formik.handleChange}
            checked={formik.values.isVerified}
          />
          <label htmlFor="isVerified">Verified</label>
        </div>

        {/* Approved */}
        <div className="flex items-start gap-1">
          <input
            id="isApproved"
            name="isApproved"
            type="checkbox"
            onChange={formik.handleChange}
            checked={formik.values.isApproved}
          />
          <label htmlFor="isApproved">Approved</label>
        </div>

        {/* Submit Button */}
        <button
          className="btn btn-primary flex gap-3 items-center"
          type="submit"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating Seller..." : "Update Seller"}{" "}
          {isUpdating && <ImSpinner3 className="animate-spin" />}
        </button>

        {isError && <div className="error">Error: {error.message}</div>}
      </form>
    </div>
  );
};

export default EditSellerPage;
