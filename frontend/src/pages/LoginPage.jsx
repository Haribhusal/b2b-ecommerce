import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";

const LoginPage = () => {
  return (
    <section className="p-5 md:p-10 flex gap-5 md:grap-10 justify-center">
      <div className="heading w-full  md:w-1/4 ">
        <h1 className="text-2xl  md:text-3xl title">Login</h1>
        <p className="uppercase text-gray-500 mb-2">Seller Login</p>
        <LoginForm />
        <div className="action text-slate-500 pt-5 mt-5 border-t-[1px] border-gray-200">
          <Link to="/register" className="flex flex-col">
            Don&apos;t have an account?{" "}
            <span className="text-orange-500 flex  items-center">
              Register Now <FaAngleRight />{" "}
            </span>
          </Link>
          <Link to="/reset-password" className="flex flex-col mt-3">
            Forgot password?
            <span className="text-orange-500 flex  items-center">
              Reset Now <FaAngleRight />{" "}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
