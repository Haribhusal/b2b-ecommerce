import React from "react";
import "./../loader.css";

const Loader = () => {
  return (
    <div className="h-screen  w-screen z-50 fixed left-0 top-0 bg-orange-900/20 flex justify-center items-center">
      <div className="flex flex-col gap-5">
        <div className="loader"></div>
        Loading...
      </div>
    </div>
  );
};

export default Loader;
