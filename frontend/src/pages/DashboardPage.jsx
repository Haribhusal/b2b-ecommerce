import React from "react";

import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useCompanies } from "../hooks/useCompanies";
import { useSellers } from "../hooks/useSeller";
import { useOrders } from "../hooks/useOrders";
import { AiFillProduct } from "react-icons/ai";
import Loader from "../components/Loader";
import OrdersLineChart from "./../components/dashboard/OrdersLineChart";
const DashboardPage = () => {
  const { data: products, isLoading: productsLoading } = useProducts(); // Include refetch function
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: sellers, isLoading: sellersLoading } = useSellers();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (
    productsLoading ||
    categoriesLoading ||
    companiesLoading ||
    sellersLoading ||
    ordersLoading
  )
    return <Loader />;

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Dashboard </h3>
      </div>
      <section className=" flex gap-5 justify-between">
        <div className="w-full md:w-1/4">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex items-center py-3 px-5 rounded-md shadow-lg shadow-orange-100 justify-between ">
              <div className="flex items-center gap-3">
                <AiFillProduct className="h-12 w-12 bg-orange-100 p-2 text-orange-500 rounded-md" />
                <h3 className="">Products</h3>
              </div>
              <span className="text-2xl">{products?.length}</span>
            </div>
            <div className="flex items-center py-3 px-5 rounded-md shadow-lg shadow-orange-100 justify-between">
              <div className="info flex gap-3 items-center">
                <AiFillProduct className="h-12 w-12 bg-orange-100 p-2 text-orange-500 rounded-md" />
                <h3 className="">Categories</h3>
              </div>
              <span className="text-2xl">{categories?.length}</span>
            </div>
            <div className="flex items-center py-3 px-5 rounded-md shadow-lg shadow-orange-100 justify-between">
              <div className="info flex gap-3 items-center">
                <AiFillProduct className="h-12 w-12 bg-orange-100 p-2 text-orange-500 rounded-md" />
                <h3 className="">Companies</h3>
              </div>
              <span className="text-2xl">{companies?.length}</span>
            </div>
            <div className="flex items-center py-3 px-5 rounded-md shadow-lg shadow-orange-100 justify-between">
              <div className="info flex gap-3 items-center">
                <AiFillProduct className="h-12 w-12 bg-orange-100 p-2 text-orange-500 rounded-md" />
                <h3 className="">Sellers</h3>
              </div>
              <span className="text-2xl">{sellers?.length}</span>
            </div>
            <div className="flex items-center py-3 px-5 rounded-md shadow-lg shadow-orange-100 justify-between">
              <div className="info flex gap-3 items-center">
                <AiFillProduct className="h-12 w-12 bg-orange-100 p-2 text-orange-500 rounded-md" />
                <h3 className="">Orders</h3>
              </div>
              <span className="text-2xl">{orders?.length}</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4">
          <div className="card flex-col items-start">
            <h3 className="title text-xl">Recent Orders</h3>
            <OrdersLineChart />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
