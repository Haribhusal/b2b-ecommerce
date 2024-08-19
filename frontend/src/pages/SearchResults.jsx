import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchProducts } from "../hooks/useProducts";
import Product from "./../components/Product";
import Loader from "../components/Loader";

const SearchResults = () => {
  const { search } = useLocation();
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);
    setFilters({
      searchTerm: params.get("searchTerm") || "",
      category: params.get("category") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      sortBy: params.get("sortBy") || "",
      order: params.get("order") || "asc",
    });
  }, [search]);

  const handleSortChange = (sortOption) => {
    const newParams = new URLSearchParams(filters);
    newParams.set("sortBy", sortOption);
    newParams.set("order", sortOption === "price" ? "asc" : "desc");
    navigate(`/search?${newParams.toString()}`);
  };

  const query = new URLSearchParams(filters).toString();
  const { data: products, error, isLoading } = useSearchProducts(query);
  console.log(products);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section className="px-5 md:px-10 py-3 md:py-5">
      <div className="heading flex justify-between">
        <h2 className="text-xl">Search Results</h2>
        <div className="filters">
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="price">Price (Low to High)</option>
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Recently Added</option>
          </select>
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </ul>
    </section>
  );
};

export default SearchResults;
