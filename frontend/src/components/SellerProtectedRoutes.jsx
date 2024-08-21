import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./../components/dashboard/Sidebar";
import { Toaster } from "react-hot-toast";

const SellerProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  const userStored = localStorage.getItem("user");
  const userObj = userStored ? JSON.parse(userStored) : null;

  const location = useLocation();

  // Redirect to login if there's no token
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect seller users to the seller dashboard
  if (userObj?.role !== "seller") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render the protected route content if the user is authenticated and not a seller
  return (
    <main className="flex ">
      <Sidebar user={userObj} />
      <div className="w-full md:w-3/4">
        <Toaster />
        <Outlet />
      </div>
    </main>
  );
};

export default SellerProtectedRoutes;
