import React from "react";

import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useCompanies } from "../../hooks/useCompanies";
import { useSellers } from "../../hooks/useSeller";
import { useOrders } from "../../hooks/useOrders";
import { AiFillProduct } from "react-icons/ai";
import Loader from "../../components/Loader";
import OrdersBarChart from "../../components/dashboard/OrdersBarChart";

const ReportsPage = () => {
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
        <h3 className="title text-xl">Order Report </h3>
      </div>
      <section>
        <OrdersBarChart />
      </section>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="flex items-center p-5 rounded-md shadow-lg shadow-orange-100 justify-between ">
            <div className="flex items-center gap-3">
              <AiFillProduct className="h-12 w-12 bg-orange-100 p-2 text-orange-500 rounded-md" />
              <h3 className="">Products</h3>
            </div>
            <span className="text-3xl">{products?.length}</span>
          </div>
          <div className="flex items-center p-5 rounded-md shadow-lg shadow-orange-100 justify-between">
            <div className="info flex gap-3 items-center">
              <AiFillProduct className="h-12 w-12 bg-white p-2 text-orange-500 rounded-md" />
              <h3 className="">Categories</h3>
            </div>
            <span className="text-3xl">{categories?.length}</span>
          </div>
          <div className="flex items-center p-5 rounded-md shadow-lg shadow-orange-100 justify-between">
            <div className="info flex gap-3 items-center">
              <AiFillProduct className="h-12 w-12 bg-white p-2 text-orange-500 rounded-md" />
              <h3 className="">Companies</h3>
            </div>
            <span className="text-3xl">{companies?.length}</span>
          </div>
          <div className="flex items-center p-5 rounded-md shadow-lg shadow-orange-100 justify-between">
            <div className="info flex gap-3 items-center">
              <AiFillProduct className="h-12 w-12 bg-white p-2 text-orange-500 rounded-md" />
              <h3 className="">Sellers</h3>
            </div>
            <span className="text-3xl">{sellers?.length}</span>
          </div>
          <div className="flex items-center p-5 rounded-md shadow-lg shadow-orange-100 justify-between">
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

export default ReportsPage;
