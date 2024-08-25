import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { TbPasswordFingerprint } from "react-icons/tb";
import ChangePassword from "./../components/ChangePasswordForm";

const SettingsPage = () => {
  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Settings</h3>
        <Link to="/dashboard/add-product">
          <button className="btn btn-primary">Back</button>
        </Link>
      </div>
      <section>
        <div className="menu flex gap-3 ">
          <NavLink
            to="manage-products"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link bg-orange-50 rounded-md hover:bg-orange-500 hover:text-white ${
                isActive ? "bg-orange-500 text-white" : ""
              }`
            }
          >
            <div className="icon">
              <TbPasswordFingerprint />
            </div>
            <div className="label">Change Password</div>
          </NavLink>
          <NavLink
            to="manage-products"
            className={({ isActive }) =>
              `flex px-5 py-3 gap-3 items-center link bg-orange-50 rounded-md hover:bg-orange-500 hover:text-white ${
                isActive ? "bg-orange-500 text-white" : ""
              }`
            }
          >
            <div className="icon">
              <MdDashboard />
            </div>
            <div className="label">Others</div>
          </NavLink>
        </div>
      </section>
      <section className="py-5">
        <ChangePassword />
      </section>
    </div>
  );
};

export default SettingsPage;
