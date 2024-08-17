import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCompany, useUpdateCompany } from "../../hooks/useCompanies";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import Loader from "../../components/Loader";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  taxId: Yup.string().required("Tax ID is required"),
});

const EditCompanyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading, error } = useCompany(id);
  const { mutate: updateCompany, isLoading: isUpdating } = useUpdateCompany();

  useEffect(() => {
    if (company) {
      formik.setValues({
        name: company.name,
        address: company.address,
        phone: company.phone,
        email: company.email,
        taxId: company.taxId,
      });
    }
  }, [company]);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateCompany(
        { id, ...values },
        {
          onSuccess: () => {
            toast.success("Company updated successfully");
            navigate("/dashboard/manage-companies");
          },
          onError: (err) => {
            toast.error(err.message || "Failed to update company");
          },
        }
      );
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <form onSubmit={formik.handleSubmit} className="p-5">
      <div className="heading title text-xl">Edit Company</div>
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

      <button type="submit" disabled={isUpdating} className="btn btn-primary">
        {isUpdating ? "Updating..." : "Update Company"}
        {isUpdating && <ImSpinner3 className="animate-spin" />}
      </button>
    </form>
  );
};

export default EditCompanyPage;
