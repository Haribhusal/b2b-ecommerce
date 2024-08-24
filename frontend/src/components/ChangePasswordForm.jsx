import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useChangePassword } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
});

const ChangePasswordForm = () => {
  const {
    mutate: changePassword,
    isLoading,
    isError,
    error,
  } = useChangePassword();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      changePassword(values, {
        onSuccess: (data) => {
          toast.success(data.message || "Password changed successfully");
        },
        onError: (error) => {
          toast.error(error.message || "An error occurred");
        },
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <label htmlFor="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          placeholder="Enter current password"
          onChange={formik.handleChange}
          value={formik.values.currentPassword}
        />
        {formik.errors.currentPassword && (
          <div className="error">{formik.errors.currentPassword}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          onChange={formik.handleChange}
          value={formik.values.newPassword}
        />
        {formik.errors.newPassword && (
          <div className="error">{formik.errors.newPassword}</div>
        )}
      </div>

      <button
        className="btn btn-primary flex gap-3 items-center"
        type="submit"
        disabled={isLoading}
      >
        Change Password
        {isLoading && <ImSpinner3 className="animate-spin" />}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default ChangePasswordForm;
