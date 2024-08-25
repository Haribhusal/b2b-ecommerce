import React from "react";
import { useForgotPassword } from "../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { Link } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const {
    mutate: forgotPassword,
    isPending: isLoading,
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
        onSuccess: () => {
          toast.success("Password reset email sent");
        },
        onError: (error) => {
          toast.error(error.message || "An error occurred");
        },
      });
    },
  });

  return (
    <section className="p-5 md:p-10 flex gap-5 md:grap-10 justify-center">
      <div className="heading w-full  md:w-1/4 ">
        <h1 className="text-2xl  md:text-3xl title">Forgot Password?</h1>
        <p className="uppercase text-gray-500 mb-2">Reset your password</p>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email && (
              <div className="error">{formik.errors.email}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <ImSpinner3 className="animate-spin" />
            ) : (
              "Send Reset Email"
            )}
          </button>

          {isError && <div className="error">Error: {error.message}</div>}
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
