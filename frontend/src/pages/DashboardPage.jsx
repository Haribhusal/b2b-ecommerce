import React from "react";

import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useCompanies } from "../hooks/useCompanies";
import { useSellers } from "../hooks/useSeller";
import { useOrders } from "../hooks/useOrders";
import { AiFillProduct } from "react-icons/ai";

const DashboardPage = () => {
  const { data: products } = useProducts(); // Include refetch function
  const { data: categories } = useCategories();
  const { data: companies } = useCompanies();
  const { data: sellers } = useSellers();
  const { data: orders } = useOrders();

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Dashboard </h3>
      </div>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="stat items-center card bg-orange-100 p-3 md:p-5 flex gap-5 justify-between">
            <div className="info flex gap-3 items-center">
              <AiFillProduct className="h-12 w-12 bg-white p-2 text-orange-500 rounded-md" />
              <h3 className="">Products</h3>
            </div>
            <span className="text-3xl">{products?.length}</span>
          </div>
          <div className="stat items-center card bg-orange-100 p-3 md:p-5 flex gap-5 justify-between">
            <div className="info flex gap-3 items-center">
              <AiFillProduct className="h-12 w-12 bg-white p-2 text-orange-500 rounded-md" />
              <h3 className="">Categories</h3>
            </div>
            <span className="text-3xl">{categories?.length}</span>
          </div>
          <div className="stat items-center card bg-orange-100 p-3 md:p-5 flex gap-5 justify-between">
            <div className="info flex gap-3 items-center">
              <AiFillProduct className="h-12 w-12 bg-white p-2 text-orange-500 rounded-md" />
              <h3 className="">Companies</h3>
            </div>
            <span className="text-3xl">{companies?.length}</span>
          </div>
          <div className="stat items-center card bg-orange-100 p-3 md:p-5 flex gap-5 justify-between">
            <div className="info flex gap-3 items-center">
              <AiFillProduct className="h-12 w-12 bg-white p-2 text-orange-500 rounded-md" />
              <h3 className="">Sellers</h3>
            </div>
            <span className="text-3xl">{sellers?.length}</span>
          </div>
          <div className="stat items-center card bg-orange-100 p-3 md:p-5 flex gap-5 justify-between">
            <div className="info flex gap-3 items-center">
              <AiFillProduct className="h-12 w-12 bg-white p-2 text-orange-500 rounded-md" />
              <h3 className="">Orders</h3>
            </div>
            <span className="text-3xl">{orders?.length}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
