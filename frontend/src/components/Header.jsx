import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { useLogoutUser } from "./../hooks/useAuth";
import { useSelector } from "react-redux";
import { formatPrice } from "./../utils/formatPrice";
import HeaderSearch from "./../components/HeaderSearch";
import { jwtDecode } from "jwt-decode";
import { TbCirclesRelation } from "react-icons/tb";
import { FaSearch, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userStored = localStorage.getItem("user");
  const userObj = JSON.parse(userStored);

  const handleLogout = useLogoutUser();
  const { totalQuantity, totalPrice } = useSelector((state) => state.cart);

  const logOut = () => {
    handleLogout();
    // localStorage.removeItem("token");
  };

  const toggleSlide = () => {
    setIsOpen(!isOpen); // Toggle the state
  };

  // useEffect(() => {}, [userObj?.token]);

  return (
    <>
      <header className=" border-t-2 border-orange-500  justify-between sticky top-0 bg-white z-40 shadow-sm items-center max-w-screen-2xl px-3 md:px-10 grid grid-cols-1 md:grid-cols-12  ">
        <div className="  text-2xl py-3 font-semibold flex gap-3 items-center col-span-4">
          <h1 className="text-orange-500 ">
            <Link to="/" className="flex items-center gap-1">
              <TbCirclesRelation />
              Bizquest
            </Link>
          </h1>
          <button className="tag text-base font-normal" onClick={toggleSlide}>
            {!isOpen ? (
              <>
                <FaSearch />
                Search or Filter Products
              </>
            ) : (
              <>
                <FaTimes />
                Hide
              </>
            )}
          </button>
        </div>
        <div className="menu flex gap-3 text-gray-500 col-span-4  justify-center">
          <Link className="link" to="/">
            Home
          </Link>
          <Link className="link" to="/products">
            Products
          </Link>
          <Link className="link" to="/categories">
            Categories
          </Link>
          <Link className="link" to="/categories">
            Become Seller
          </Link>
        </div>
        <div className="buttons flex gap-3 items-center col-span-4 justify-end">
          {token ? (
            <>
              <div className="">
                Welcome, <span className="capitalize">{userObj.name}</span>
              </div>
              <Link
                className="link relative flex gap-1 items-center"
                to="/cart"
              >
                <FaCartShopping />
                <span className="absolute -top-3 -left-2  bg-orange-500/90 text-white text-sm px-1 rounded-sm">
                  {totalQuantity}
                </span>
                <span>Rs.{formatPrice(totalPrice)}</span>
              </Link>
              <Link
                className="link"
                to={userObj.role === "admin" ? "/dashboard" : "/seller"}
              >
                Dashboard
              </Link>
              {/* <Link className="link" to="/profile">
              Profile
            </Link> */}
              <button className="btn btn-bordered" onClick={logOut}>
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
      <div
        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
          isOpen ? "max-h-40" : "max-h-0"
        }`}
      >
        <HeaderSearch />
      </div>
    </>
  );
};

export default Header;
