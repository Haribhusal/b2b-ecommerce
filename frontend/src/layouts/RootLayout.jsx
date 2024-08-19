import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <>
      <Header />
      <Toaster />
      <main className="min-h-screen bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
