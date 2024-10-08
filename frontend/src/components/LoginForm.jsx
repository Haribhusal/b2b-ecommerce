import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginUser } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^(?!.*@[^,]*,)/)
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { mutate: loginUser, isLoading, isError, error } = useLoginUser();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      loginUser(values, {
        onSuccess: (data) => {
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("token", data.token);
          toast.success(data.message || "Login successful");
          // Save token or user data in local storage/session storage if needed
          // Redirect to dashboard or home page after successful login
          if (data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/seller");
          }
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
        className="btn btn-primary flex gap-2 items-center"
        type="submit"
        disabled={isLoading}
      >
        {isLoading}
        Login
        {isLoading ? <ImSpinner3 className="animate-spin" /> : <FaAngleRight />}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default LoginForm;
