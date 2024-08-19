import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { useLogoutUser } from "./../hooks/useAuth";
import { useSelector } from "react-redux";
import { formatPrice } from "./../utils/formatPrice";
import HeaderSearch from "./../components/HeaderSearch";

const Header = () => {
  const token = localStorage.getItem("token");

  const userStored = localStorage.getItem("user");
  const userObj = JSON.parse(userStored);

  const handleLogout = useLogoutUser();
  const { totalQuantity, totalPrice } = useSelector((state) => state.cart);

  const logOut = () => {
    handleLogout();
    // localStorage.removeItem("token");
  };

  useEffect(() => {}, [token]);

  return (
    <>
      <header className="flex border-t-2 border-orange-500  justify-between sticky top-0 bg-white z-40 shadow-sm items-center max-w-screen-2xl px-3 md:px-10  ">
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
              <Link className="link" to="/dashboard">
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
      <HeaderSearch />
    </>
  );
};

export default Header;
