// src/components/CategoryList.js
import React from "react";
import { useCategories } from "../hooks/useCategories";
import Loader from "./Loader";

const CategoriesList = () => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  const renderCategories = (categories, parentId = null) => {
    const filteredCategories = categories.filter(
      (category) => category.parent?._id === parentId
    );

    return (
      <ul>
        {filteredCategories.map((category) => (
          <li key={category._id}>
            <div>{category.name}</div>
            {renderCategories(categories, category._id)}
          </li>
        ))}
      </ul>
    );
  };

  return <div>{renderCategories(categories)}</div>;
};

export default CategoriesList;
