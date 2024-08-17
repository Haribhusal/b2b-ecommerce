import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <section className="p-5 md:p-10 flex gap-5 md:grap-10 justify-center">
      <div className="heading w-full md:w-1/4 ">
        <h1 className="text-2xl  md:text-5xl title">Login</h1>
        <p className="uppercase text-gray-500 my-3">Seller Login</p>
        <LoginForm />
      </div>
    </section>
  );
};

export default LoginPage;
