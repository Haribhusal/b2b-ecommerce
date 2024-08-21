import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import Loader from "./Loader";

const HeaderSearch = () => {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      searchTerm,
      category,
      minPrice,
      maxPrice,
    }).toString();
    navigate(`/search?${queryParams}`);
  };

  if (isCategoriesLoading) return <Loader />;
  if (categoriesError)
    return <div>Error occured {categoriesError.message}</div>;
  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-3 items-center py-3 md:px-10 shadow-inner shadow-orange-100"
    >
      <div className="flex-3">Search or Filter Products</div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Product Name..."
        className="input flex-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1"
      >
        <option value="">Select a category</option>
        {categories?.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min Price"
        className="input flex-1 w-24"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max Price"
        className="input flex-1 w-24"
      />
      <button type="submit" className="btn btn-primary w-36">
        Search Products
      </button>
    </form>
  );
};

export default HeaderSearch;
