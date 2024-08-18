import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateProduct, useProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useCompanies } from "../../hooks/useCompanies";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Loader from "./../../components/Loader";

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  price: Yup.number()
    .min(0, "Price must be a positive number")
    .required("Price is required"),
  discountType: Yup.string()
    .oneOf(["flat", "percentage", ""], "Invalid discount type")
    .nullable(),
  discountValue: Yup.number().required("Discount value is required").nullable(),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  company: Yup.string().required("Company is required"),
  quantity: Yup.number()
    .min(0, "Quantity must be a positive number")
    .required("Please add a product quantity"),
});

const ProductEditForm = ({ id }) => {
  const navigate = useNavigate();

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(id);
  const {
    mutate: updateProduct,
    isLoading: isUpdating,
    isError,
    error,
  } = useUpdateProduct();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories();
  const {
    data: companies,
    isLoading: isCompaniesLoading,
    error: companiesError,
  } = useCompanies();

  useEffect(() => {
    if (product) {
      formik.setValues({
        name: product.name,
        price: product.price,
        description: product.description,
        discountType: product.discountType || "",
        discountValue: product.discountValue || "",
        category: product.category?._id,
        company: product.company?._id,
        quantity: product.quantity,
      });
    }
  }, [product]);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      discountType: "", // Discount type
      discountValue: "", // Discount value
      category: "",
      company: "",
      quantity: "",
    },
    validationSchema,
    enableReinitialize: true, // Reinitialize form values when product data changes
    onSubmit: (values) => {
      const { price, discountType, discountValue } = values;

      let finalPrice = price;
      if (discountType === "flat") {
        finalPrice -= discountValue;
      } else if (discountType === "percentage") {
        finalPrice -= (price * discountValue) / 100;
      }

      finalPrice = Math.max(finalPrice, 0);

      updateProduct(
        { id, ...values, finalPrice },
        {
          onSuccess: () => {
            toast.success("Product updated successfully");
            navigate("/dashboard/manage-products");
          },
          onError: (error) => {
            toast.error(error.message || "An error occurred");
          },
        }
      );
    },
  });

  if (isProductLoading || isCategoriesLoading || isCompaniesLoading)
    return <Loader />;
  if (productError || categoriesError || companiesError)
    return (
      <div>
        Error loading data:{" "}
        {productError?.message ||
          categoriesError?.message ||
          companiesError?.message}
      </div>
    );

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Product Name */}
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter product name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.errors.name && (
          <div className="error">{formik.errors.name}</div>
        )}
      </div>

      {/* Price */}
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          placeholder="Enter price"
          onChange={formik.handleChange}
          value={formik.values.price}
        />
        {formik.errors.price && (
          <div className="error">{formik.errors.price}</div>
        )}
      </div>

      {/* Discount Type */}
      <div className="form-group">
        <label htmlFor="discountType">Discount Type</label>
        <select
          id="discountType"
          name="discountType"
          onChange={formik.handleChange}
          value={formik.values.discountType}
        >
          <option value="">No Discount</option>
          <option value="flat">Flat Amount</option>
          <option value="percentage">Percentage</option>
        </select>
        {formik.errors.discountType && (
          <div className="error">{formik.errors.discountType}</div>
        )}
      </div>

      {/* Discount Value */}
      {formik.values.discountType && (
        <div className="form-group">
          <label htmlFor="discountValue">Discount Value</label>
          <input
            id="discountValue"
            name="discountValue"
            type="number"
            placeholder={`Enter discount value ${
              formik.values.discountType === "percentage" ? "%" : "Rs"
            }`}
            onChange={formik.handleChange}
            value={formik.values.discountValue}
          />
          {formik.errors.discountValue && (
            <div className="error">{formik.errors.discountValue}</div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Enter product description"
          onChange={formik.handleChange}
          value={formik.values.description}
        />
        {formik.errors.description && (
          <div className="error">{formik.errors.description}</div>
        )}
      </div>

      {/* Category */}
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          onChange={formik.handleChange}
          value={formik.values.category}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {formik.errors.category && (
          <div className="error">{formik.errors.category}</div>
        )}
      </div>

      {/* Company */}
      <div className="form-group">
        <label htmlFor="company">Company</label>
        <select
          id="company"
          name="company"
          onChange={formik.handleChange}
          value={formik.values.company}
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>
        {formik.errors.company && (
          <div className="error">{formik.errors.company}</div>
        )}
      </div>

      {/* Quantity */}
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          placeholder="Enter quantity"
          onChange={formik.handleChange}
          value={formik.values.quantity}
        />
        {formik.errors.quantity && (
          <div className="error">{formik.errors.quantity}</div>
        )}
      </div>

      {/* Submit Button */}
      <button
        className="btn btn-primary flex gap-3 items-center"
        type="submit"
        disabled={isUpdating}
      >
        {isUpdating ? "Updating Product..." : "Update Product"}{" "}
        {isUpdating && <ImSpinner3 className="animate-spin" />}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default ProductEditForm;
