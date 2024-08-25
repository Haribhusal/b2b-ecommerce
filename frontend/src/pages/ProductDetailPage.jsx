import React from "react";
import { useDispatch } from "react-redux";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { addToCart } from "../features/cartSlice";
import Loader from "../components/Loader";
import { IoMdPricetag } from "react-icons/io";
import { formatPrice } from "../utils/formatPrice";
import { useCategoryProducts } from "../hooks/useProducts";
import toast from "react-hot-toast";
import Product from "../components/Product";
import { HiSquare3Stack3D } from "react-icons/hi2";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { data: product, error, isLoading } = useProduct(productId);
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useCategoryProducts(product?.category._id);

  const handleClick = () => {
    if (localStorage.getItem("token")) {
      dispatch(addToCart(product));
    } else {
      navigate("/login");
      toast.error("Please login to add item in the cart");
    }
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error handling for product details
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Error handling for related products
  if (productsLoading) {
    return <Loader />;
  }

  if (productsError) {
    return <div>Error: {productsError.message}</div>;
  }

  // Check if product exists
  if (!product) {
    return <div>Product not found</div>;
  }

  // Filter out the current product from related products
  const relatedProducts = products.filter(
    (relatedProduct) => relatedProduct._id !== product._id
  );

  return (
    <>
      <section className="px-5 md:px-10 py-3 md:py-5 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-10">
        <div className="images col-span-1 flex flex-col gap-3">
          {product.images.map((item) => (
            <img
              key={item._id}
              className="image h-16 object-cover rounded-md"
              src={item.url}
              alt={product.name}
            />
          ))}
        </div>
        <div className="images col-span-3">
          <img
            className="image rounded-md"
            src={product.images[0].url}
            alt={product.name}
          />
        </div>
        <div className="details col-span-5 flex-col md:flex items-start">
          <div className="tags w-full flex gap-3 items-center">
            <Link to={"/"}>
              <div className="tag text-sm w-auto">
                <FaAngleLeft className="text-sm" /> Back
              </div>
            </Link>
            <div className="tag text-sm w-auto">
              <IoMdPricetag className="text-sm" /> {product.category.name}
            </div>
            <div className="tag text-sm w-auto">
              <HiSquare3Stack3D className="text-sm" /> {product.quantity} items
              in stock
            </div>
          </div>

          <h3 className="title mt-5 text-2xl">{product.name}</h3>
          <div className="flex bg-white px-5 py-3 shadow-inner shadow-orange-300 rounded-md w-full items-center gap-5 my-5 justify-between">
            <span className="text-3xl font-bold">
              Rs. {formatPrice(product.finalPrice)}
            </span>
            <div className="flex gap-3 items-center">
              {product.discountValue !== 0 && (
                <div className="flex gap-3 items-center">
                  <div className="flex gap-2">
                    Rs.{" "}
                    <span className="line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  |
                  <span>
                    {product.discountType === "percentage"
                      ? `${product.discountValue} %`
                      : `Rs ${product.discountValue}`}{" "}
                    Off
                  </span>
                </div>
              )}
              <button className="btn btn-primary" onClick={handleClick}>
                Add to cart
              </button>
            </div>
          </div>

          <p className="details">{product.description.slice(0, 300)}</p>
        </div>
        <div className="meta col-span-3"></div>
      </section>

      <section className="px-5 md:px-10 py-5 bg-white">
        <div className="heading text-slate-600 text-xl mb-3">
          Related Products
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relatedProduct) => (
              <Product key={relatedProduct._id} product={relatedProduct} />
            ))
          ) : (
            <div>No related products found.</div>
          )}
        </ul>
      </section>
    </>
  );
};

export default ProductDetailPage;
