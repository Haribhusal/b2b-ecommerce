import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useOrders } from "./../../hooks/useOrders"; // Replace with the correct path
import { format, parseISO } from "date-fns";
import Loader from "../Loader";

const OrdersBarChart = () => {
  const { data: orders, isLoading, error } = useOrders();

  const chartData = useMemo(() => {
    if (!orders) return [];

    const data = orders.reduce((acc, order) => {
      const date = format(parseISO(order.createdAt), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = { day: date, totalAmount: 0 };
      }
      acc[date].totalAmount += order.totalPrice;
      return acc;
    }, {});

    return Object.values(data);
  }, [orders]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalAmount" fill="#f97316" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OrdersBarChart;
