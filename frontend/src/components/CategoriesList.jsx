import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useCategoryProducts } from "../hooks/useProducts";
import Loader from "./Loader";
import Product from "./Product";
import { FaAngleLeft, FaPlus } from "react-icons/fa";

const CategoriesList = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showItems, setShowItems] = useState(12);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useCategoryProducts(selectedCategory);

  if (categoriesLoading) return <Loader />;
  if (categoriesError) return <div>Error: {categoriesError.message}</div>;

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const renderCategories = (categories, parentId = null) => {
    const filteredCategories = categories.filter(
      (category) => (category.parent?._id || null) === parentId
    );

    if (filteredCategories.length === 0) {
      return null;
    }

    return (
      <ul className="flex flex-wrap p-3 gap-3 items-center">
        {filteredCategories.slice(0, showItems).map((category) => (
          <li key={category._id} className="flex gap-3 items-center">
            <div
              onClick={() => handleCategoryClick(category._id)}
              style={{ cursor: "pointer" }}
            >
              {category.name}
            </div>
            <div className="child bg-white rounded-md">
              {selectedCategory === category._id &&
                renderCategories(categories, category._id)}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderProducts = (products) => {
    if (productsLoading) return <Loader />;
    if (productsError) return <div>Error: {productsError.message}</div>;

    if (products.length === 0) {
      return <div>No products found for this category.</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    );
  };

  const parentCategoryId = selectedCategory
    ? categories.find((cat) => cat._id === selectedCategory)?.parent?._id
    : null;

  return (
    <div className="">
      <div className="wrap flex  px-5 md:px-10 bg-orange-100 items-center">
        {selectedCategory && parentCategoryId && (
          <button
            className=""
            onClick={() => setSelectedCategory(parentCategoryId)}
          >
            <FaAngleLeft className="h-8 w-8 bg-white rounded-full p-2 flex justify-center items-center" />
          </button>
        )}
        <div className="categories-list">
          {renderCategories(categories, parentCategoryId)}
        </div>
        <div
          className="plus absolute right-5"
          onClick={() => setShowItems(showItems + 5)}
        >
          <FaPlus className="h-8 w-8 bg-white cursor-pointer rounded-full p-2 flex justify-center items-center" />
        </div>
      </div>

      {selectedCategory && (
        <div className="px-5 md:px-10  py-5">
          <div className="heading text-slate-600 text-xl mb-3">
            Products in{" "}
            {categories.find((cat) => cat._id === selectedCategory)?.name}
          </div>

          {renderProducts(products)}
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
