import React from "react";
import "./../loader.css";

const Loader = () => {
  return (
    <div className="h-screen  w-screen z-50 fixed left-0 top-0 bg-gray-100/80  flex justify-center items-center">
      <div className="loader  "></div>
    </div>
  );
};

export default Loader;
