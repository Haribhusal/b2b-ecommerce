import React from "react";
import { MdDashboard } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { FaBuildingWheat } from "react-icons/fa6";
import { useLogoutUser } from "../../hooks/useAuth";

const Sidebar = ({ user }) => {
  const handleLogout = useLogoutUser();
  const isSeller = user.role === "seller";
  const isAdmin = user.role === "admin";

  const logOut = () => {
    handleLogout();
    // localStorage.removeItem("token");
  };

  return (
    <aside className="w-full md:w-1/4 bg-orange-100 min-h-screen border-l-2 border-orange-500">
      <Link
        to={isAdmin ? "/dashboard" : "/seller"}
        className="p-5 flex items-center gap-2 text-gray-700"
      >
        <FaBuildingWheat className="text-3xl text-orange-500" />
        <div className="span font-semibold">BizQuest</div>
      </Link>

      <div className="heading capitalize p-3 px-5 bg-orange-500 text-white">
        Welcome, {user.name}
      </div>
      {isAdmin && (
        <div className="menu">
          <NavLink
            to="manage-products"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link hover:bg-white ${
                isActive ? "bg-white text-orange-600" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">Manage Products</div>
          </NavLink>
          <NavLink
            to="manage-categories"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link hover:bg-white ${
                isActive ? "bg-white text-orange-600" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">Manage Categories</div>
          </NavLink>
          <NavLink
            to="manage-companies"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link hover:bg-white ${
                isActive ? "bg-white text-orange-600" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">Manage Companies</div>
          </NavLink>
          <NavLink
            to="manage-sellers"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link hover:bg-white ${
                isActive ? "bg-white text-orange-600" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">Manage Sellers</div>
          </NavLink>
          <NavLink
            to="manage-orders"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link hover:bg-white ${
                isActive ? "bg-white text-orange-600" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">Manage Orders</div>
          </NavLink>
          <NavLink
            to="reports"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link hover:bg-white ${
                isActive ? "bg-white text-orange-600" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">Reports</div>
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link hover:bg-white ${
                isActive ? "bg-white text-orange-600" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">Settings</div>
          </NavLink>
        </div>
      )}
      {isSeller && (
        <div className="menu">
          <NavLink
            to="manage-orders"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link hover:bg-white ${
                isActive ? "bg-white text-orange-600" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">My Orders</div>
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link hover:bg-white ${
                isActive ? "bg-white text-orange-600" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">Settings</div>
          </NavLink>
        </div>
      )}

      <div
        onClick={() => logOut()}
        className="flex px-5 cursor-pointer py-3 gap-3 items-center link hover:bg-white"
      >
        <div className="icon">
          <MdDashboard />
        </div>
        <div className="label">Logout</div>
      </div>
      <NavLink
        to="/"
        className="flex px-5 cursor-pointer py-3 gap-3 items-center link hover:bg-white"
      >
        <div className="icon">
          <MdDashboard />
        </div>
        <div className="label">Exit Dashboard</div>
      </NavLink>
    </aside>
  );
};

export default Sidebar;
