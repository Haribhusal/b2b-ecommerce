import React from "react";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-full md:w-1/4 bg-orange-100 text-white min-h-screen">
      <div className="heading  p-3 px-5 bg-orange-400">Welcome Back, Hari!</div>
      <div className="menu">
        <Link
          to="/dashboard"
          className="flex px-5 py-3 gap-3 items-center link hover:bg-white"
        >
          <div className="icon">
            <MdDashboard />
          </div>
          <div className="label">Dashboard</div>
        </Link>
        <Link
          to="manage-products"
          className="flex px-5 py-3 gap-3 items-center link hover:bg-white"
        >
          <div className="icon">
            <MdDashboard />
          </div>
          <div className="label">Manage Products</div>
        </Link>
        <Link
          to="manage-categories"
          className="flex px-5 py-3 gap-3 items-center link hover:bg-white"
        >
          <div className="icon">
            <MdDashboard />
          </div>
          <div className="label">Manage Categories</div>
        </Link>

        <Link
          to="manage-sellers"
          className="flex px-5 py-3 gap-3 items-center link hover:bg-white"
        >
          <div className="icon">
            <MdDashboard />
          </div>
          <div className="label">Manage Sellers</div>
        </Link>
        <Link
          to="orders"
          className="flex px-5 py-3 gap-3 items-center link hover:bg-white"
        >
          <div className="icon">
            <MdDashboard />
          </div>
          <div className="label">Orders</div>
        </Link>
        <Link
          to="reports"
          className="flex px-5 py-3 gap-3 items-center link hover:bg-white"
        >
          <div className="icon">
            <MdDashboard />
          </div>
          <div className="label">Reports</div>
        </Link>
        <Link
          to="settings"
          className="flex px-5 py-3 gap-3 items-center link hover:bg-white"
        >
          <div className="icon">
            <MdDashboard />
          </div>
          <div className="label">Settings</div>
        </Link>
        <Link
          to="/"
          className="flex px-5 py-3 gap-3 items-center link hover:bg-white"
        >
          <div className="icon">
            <MdDashboard />
          </div>
          <div className="label">Exit</div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
