import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";

const RegisterPage = () => {
  return (
    <section className="p-5 md:p-10 flex gap-5 md:grap-10 justify-center">
      <div className="heading w-full md:w-1/4 ">
        <h1 className="text-2xl  md:text-3xl title">Register</h1>
        <p className="uppercase text-gray-500 mb-2">Seller registration</p>
        <RegisterForm />
        <div className="action text-slate-500 pt-5 mt-5 border-t-[1px] border-gray-200">
          <Link to="/login" className="flex flex-col">
            Already have account?
            <span className="text-orange-500 flex  items-center">
              Login Now <FaAngleRight />{" "}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
