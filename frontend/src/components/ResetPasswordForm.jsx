import React from "react";
import { useParams } from "react-router-dom";
import { useResetPassword } from "../hooks/useAuth"; // Assuming you have a hook for resetting passwords
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
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
          onSuccess: () => {
            toast.success("Password reset successful");
            // Redirect to login or another page after successful reset
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
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && (
          <div className="error">{formik.errors.password}</div>
        )}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? <ImSpinner3 className="animate-spin" /> : "Reset Password"}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default ResetPassword;
