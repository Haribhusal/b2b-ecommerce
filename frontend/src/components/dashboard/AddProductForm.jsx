import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useCompanies } from "../../hooks/useCompanies";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

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
  images: Yup.mixed().required("At least one image is required"),
  minimumOrder: Yup.number()
    .min(1, "Minimum order quantity must be at least 1")
    .required("Minimum order quantity is required"),
  quantity: Yup.number()
    .min(0, "Quantity must be a positive number")
    .required("Quantity is required"),
});

const ProductAddForm = () => {
  const navigate = useNavigate();
  const [minimumOrder, setMinimumOrder] = useState(1); // Initial minimum order

  const { mutate: addProduct, isPending, isError, error } = useAddProduct();
  console.log("isLoading", isPending);
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
      images: null,
      minimumOrder,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(values).forEach((key) => {
        if (key === "images" && values.images) {
          // Handle multiple images separately
          for (let i = 0; i < values.images.length; i++) {
            formData.append("images", values.images[i]);
          }
        } else {
          formData.append(key, values[key]);
        }
      });

      // Calculate finalPrice based on discountType and discountValue
      let finalPrice = values.price;
      if (values.discountType === "flat") {
        finalPrice -= values.discountValue;
      } else if (values.discountType === "percentage") {
        finalPrice -= (values.price * values.discountValue) / 100;
      }
      finalPrice = Math.max(finalPrice, 0);

      formData.append("finalPrice", finalPrice);

      addProduct(formData, {
        onSuccess: () => {
          toast.success("Product added successfully");
          formik.resetForm();
          navigate("/dashboard/manage-products");
        },
        onError: (error) => {
          toast.error(error.message || "Look, An error occurred ");
        },
      });
    },
  });

  if (isCategoriesLoading || isCompaniesLoading) return <Loader />;
  if (categoriesError || companiesError)
    return (
      <div>
        Error loading data:{" "}
        {categoriesError?.message || companiesError?.message}
      </div>
    );
  // method="POST" enctype="multipart/form-data"
  return (
    <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
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

      <div className="form-group">
        <label htmlFor="minimumOrder">Minimum Order</label>
        <input
          id="minimumOrder"
          name="minimumOrder"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.minimumOrder}
        />
        {formik.errors.minimumOrder && (
          <div className="error">{formik.errors.minimumOrder}</div>
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
      {/* Images */}
      <div className="form-group">
        <label htmlFor="images">Product Images</label>
        <input
          id="images"
          name="images"
          type="file"
          onChange={(event) => {
            formik.setFieldValue("images", event.currentTarget.files);
          }}
          multiple
        />
        {formik.errors.images && (
          <div className="error">{formik.errors.images}</div>
        )}
      </div>

      {/* Submit Button */}
      <button
        className="btn btn-primary flex gap-3 items-center"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Adding Product..." : "Add Product"}{" "}
        {isPending && <ImSpinner3 className="animate-spin" />}
      </button>

      {isError && <div className="error">Error: {error.message}</div>}
    </form>
  );
};

export default ProductAddForm;
