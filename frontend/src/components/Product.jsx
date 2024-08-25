import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "./../utils/formatPrice";
import { useDispatch } from "react-redux";
import { addToCart } from "./../features/cartSlice";
import { toast } from "react-hot-toast";
const Product = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = () => {
    if (localStorage.getItem("token")) {
      dispatch(addToCart(product));
    } else {
      navigate("/login");
      toast.error("Please login to add item in the cart");
    }
  };
  return (
    <li
      key={product._id}
      title={product.name}
      className="bg-white border-r-2 border-orange-500 relative shadow-md hover:shadow-lg transition-all p-5 rounded-md flex gap-3"
    >
      {product.discountValue !== 0 && (
        <div className="ribbon absolute right-0 top-0 text-sm rounded-bl-md  rounded-tr-md text-white bg-orange-500 px-3">
          {product.discountType === "percentage"
            ? `${product.discountValue}% off`
            : `Rs. ${product.discountValue} off`}
        </div>
      )}

      <div className="image w-32">
        <img
          src={product.images[0]?.url}
          className="rounded-md object-cover"
          alt={product.name}
        />
      </div>
      <div className="info w-full">
        <h2 className="font-semibold text-gray-700 mb-1">
          <Link
            to={`/products/${product._id}`}
            className="line-clamp-2 leading-tight"
          >
            {product.name}
          </Link>
        </h2>
        <div className="meta flex text-sm leading-normal   text-gray-600  gap-1 mb-2">
          <div className="tag">Rs. {formatPrice(product.finalPrice)}</div>
          {/* <div className="tag line-through">
            Rs. {formatPrice(product.price)}
          </div> */}
          <div className="tag">Order {product.minimumOrder}</div>
          <div className="tag">{product.category?.name}</div>
        </div>
        <div className="action flex gap-3">
          <button className="btn btn-primary" onClick={handleClick}>
            Add to cart
          </button>
          <Link to={`/products/${product._id}`}>
            <button className="btn btn-bordered">Read More</button>
          </Link>
        </div>
      </div>
    </li>
  );
};

export default Product;
