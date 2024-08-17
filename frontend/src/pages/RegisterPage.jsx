import React from "react";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <section className="p-5 md:p-10 flex gap-5 md:grap-10 justify-center">
      <div className="heading w-full md:w-1/4 ">
        <h1 className="text-2xl  md:text-5xl title">Register</h1>
        <p className="uppercase text-gray-500 my-3">Seller registration</p>
        <RegisterForm />
      </div>
    </section>
  );
};

export default RegisterPage;
