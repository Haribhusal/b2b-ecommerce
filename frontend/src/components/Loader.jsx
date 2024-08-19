import React from "react";
import "./../loader.css";

const Loader = () => {
  return (
    <div className="h-screen  w-screen fixed left-0 top-0 bg-orange-900/10 flex justify-center items-center">
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
