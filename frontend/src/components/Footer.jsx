import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 px-5 md:px-10 py-3 md:py-5 text-white">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
        <div className="column">
          <h3 className="">&copy; Bizquest, All rights reserved.</h3>
        </div>
        <div className="column flex justify-center">
          <div className="menu flex gap-3 text-gray-400">
            <Link className="" to="/">
              Home
            </Link>
            <Link className="" to="/products">
              Products
            </Link>
            <Link className="" to="/categories">
              Categories
            </Link>
          </div>
        </div>
        <div className="column text-start md:text-end">
          <h3 className="">Powered by Hari Bhusal</h3>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
