import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./../components/dashboard/Sidebar";
import { Toaster } from "react-hot-toast";
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect to login, preserving the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <main className="flex ">
      <Sidebar />
      <div className="w-full md:w-3/4">
        <Toaster />
        <Outlet />
      </div>
    </main>
  );
};

export default ProtectedRoute;
