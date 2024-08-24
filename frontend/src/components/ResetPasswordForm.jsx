import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useResetPassword } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useParams } from "react-router-dom";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const ResetPasswordForm = () => {
  const { token } = useParams();
  const {
    mutate: resetPassword,
    isLoading,
    isError,
    error,
  } = useResetPassword();

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      resetPassword(
        { token, password: values.password },
        {
          onSuccess: (data) => {
            toast.success(data.message || "Password reset successful");
          },
          onError: (error) => {
            toast.error(error.message || "An error occurred");
          },
        }
      );
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <label htmlFor="password">New Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter new password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && (
          <div className="error">{formik.errors.password}</div>
        )}
      </div>

      <button
        className="btn btn-primary flex gap-3 items-center"
        type="submit"
        disabled={isLoading}
      >
        Reset Password
        {isLoading && <ImSpinner3 className="animate-spin" />}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default ResetPasswordForm;
