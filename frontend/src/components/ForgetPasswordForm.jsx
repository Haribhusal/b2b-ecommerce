import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useForgotPassword } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPasswordForm = () => {
  const {
    mutate: forgotPassword,
    isLoading,
    isError,
    error,
  } = useForgotPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      forgotPassword(values, {
        onSuccess: (data) => {
          toast.success(data.message || "Password reset email sent");
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
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Your email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && (
          <div className="error">{formik.errors.email}</div>
        )}
      </div>

      <button
        className="btn btn-primary flex gap-3 items-center"
        type="submit"
        disabled={isLoading}
      >
        Send Reset Email
        {isLoading && <ImSpinner3 className="animate-spin" />}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default ForgotPasswordForm;
