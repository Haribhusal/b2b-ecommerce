import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddCompany } from "../../hooks/useCompanies";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  taxId: Yup.string().required("Tax ID is required"),
});

const AddCompanyPage = () => {
  const navigate = useNavigate();
  const { mutate: addCompany, isLoading } = useAddCompany();

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
    },
    validationSchema,
    onSubmit: (values) => {
      addCompany(values, {
        onSuccess: () => {
          toast.success("Company added successfully");
          navigate("/dashboard/manage-companies");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to add company");
        },
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-5">
      <div className="heading title text-xl">Add Comapany</div>
      <hr className="my-3" />
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.errors.name && (
          <div className="error">{formik.errors.name}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.address}
        />
        {formik.errors.address && (
          <div className="error">{formik.errors.address}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.phone}
        />
        {formik.errors.phone && (
          <div className="error">{formik.errors.phone}</div>
        )}
      </div>

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

      <div className="form-group">
        <label htmlFor="taxId">Tax ID</label>
        <input
          id="taxId"
          name="taxId"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.taxId}
        />
        {formik.errors.taxId && (
          <div className="error">{formik.errors.taxId}</div>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="btn btn-primary">
        {isLoading ? "Adding..." : "Add Company"}
        {isLoading && <ImSpinner3 className="animate-spin" />}
      </button>
    </form>
  );
};

export default AddCompanyPage;
