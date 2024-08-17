// src/components/GlobalFilter.jsx
import React from "react";

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span>
      Search:{" "}
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-1 rounded-md"
      />
    </span>
  );
};

export default GlobalFilter;
