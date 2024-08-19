import React from "react";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
  return (
    <section>
      <div className="container flex justify-center items-center">
        <div className="w-full  md:w-1/2 p-5 md:p-10 flex flex-col items-center gap-5 bg-white my-5 shadow-md rounded-md md:my-10 text-center">
          <img src="/order-received.svg" className="w-72" alt="" />
          <h3 className="title text-3xl">Order has been placed successfully</h3>
          <p>
            We have received your order and sent you order details in your
            email.
            <br /> You will be notified if the order is approved.
          </p>
          <Link to={"/"}>
            <button className="btn btn-primary">Check my Orders</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccessPage;
