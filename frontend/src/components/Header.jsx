import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  useEffect(() => {}, [token]);

  return (
    <header className="flex justify-between items-center max-w-screen-2xl px-3 md:px-10 shadow-md ">
      <div className=" link text-2xl py-3 font-semibold">
        <Link className="" to="/">
          Bizquest
        </Link>
      </div>
      <div className="menu flex gap-3 text-gray-500">
        <Link className="link" to="/">
          Home
        </Link>
        <Link className="link" to="/products">
          Products
        </Link>
        <Link className="link" to="/categories">
          Categories
        </Link>
      </div>
      <div className="buttons flex gap-3 items-center">
        {token ? (
          <>
            <Link className="link" to="/dashboard">
              Dashboard
            </Link>
            {/* <Link className="link" to="/profile">
              Profile
            </Link> */}
            <button className="btn btn-bordered" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn btn-bordered">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-primary">Register</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
