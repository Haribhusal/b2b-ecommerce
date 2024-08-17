import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginUser } from "../hooks/useLoginUser";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    mutate: loginUser,
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  } = useLoginUser();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      loginUser(values, {
        onSuccess: (data) => {
          toast.success(data.message || "Login successful");
          // Save token or user data in local storage/session storage if needed
          localStorage.setItem("token", data.token); // example of saving token
          // Redirect to dashboard or home page after successful login
          navigate("/dashboard");
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

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter Password"
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
        Login
        {isLoading && <ImSpinner3 className="animate-spin" />}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default LoginForm;
