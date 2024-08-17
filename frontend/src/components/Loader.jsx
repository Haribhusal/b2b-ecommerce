import React from "react";
import "./../loader.css";

const Loader = () => {
  return (
    <div className="h-screen w-screen fixed left-0 top-0 bg-gray-900/90 flex justify-center items-center">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
