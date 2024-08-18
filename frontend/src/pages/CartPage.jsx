import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaAngleLeft, FaAngleRight, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { formatPrice } from "../utils/formatPrice";
import {
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  removeFromCart,
  clearCart,
} from "../features/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAddOrder } from "../hooks/useOrders"; // Import useAddOrder hook

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );

  const { mutate: createOrder } = useAddOrder(); // Destructure mutate function from useAddOrder

  const validationSchema = Yup.object().shape({
    quantity: Yup.number()
      .min(1, "Minimum quantity is 1")
      .required("Quantity is required"),
  });

  const paymentSchema = Yup.object().shape({
    paymentMethod: Yup.string().required("Please select a payment method"),
  });

  const handleQuantityChange = (productId, quantity) => {
    dispatch(setQuantity({ productId, quantity: parseInt(quantity) }));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart({ _id: productId }));
  };

  const handleSubmit = (values) => {
    const orderData = {
      items: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.finalPrice,
      })),
      totalItems: totalQuantity,
      totalPrice: totalPrice,
      paymentMethod: values.paymentMethod,
    };

    createOrder(orderData, {
      onSuccess: () => {
        toast.success("Order Placed Successfully");
        dispatch(clearCart());
        navigate("/order-success");
        // Optionally, you can clear the cart or redirect to another page
      },
      onError: (error) => {
        console.error("Error placing order:", error);
      },
    });
  };

  return (
    <section className="flex gap-5 md:gap-10 p-5 md:p-10 bg-orange-50">
      <div className="list bg-white p-5 shadow-md rounded-md w-full md:w-3/4">
        <h3 className="title text-2xl">Cart Items</h3>
        <hr className="my-3" />
        <div className="items">
          {cartItems.length > 0 ? (
            cartItems.map((product) => (
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b-[1px] border-gray-200 py-1 items-center justify-between"
                key={product._id}
              >
                <div className="info flex gap-3 items-center text-left">
                  <button
                    className="btn text-gray-500 btn-bordered p-2"
                    onClick={() => handleRemoveFromCart(product._id)}
                  >
                    <FaTrash />
                  </button>
                  <div className="detail">
                    <h3 className="font-semibold text-xl">{product.name}</h3>
                    <span className="text-sm">
                      {product.category?.name} | {product.company?.name}
                    </span>
                  </div>
                </div>
                <div className="quantity flex justify-center">
                  <Formik
                    initialValues={{ quantity: product.quantity }}
                    validationSchema={validationSchema}
                    onSubmit={(values) =>
                      handleQuantityChange(product._id, values.quantity)
                    }
                    enableReinitialize
                  >
                    {({ values, handleSubmit }) => (
                      <Form
                        className="flex items-center gap-2"
                        onBlur={() => handleSubmit()}
                      >
                        <button
                          type="button"
                          className="btn btn-primary text-xl"
                          onClick={() =>
                            dispatch(decreaseQuantity(product._id))
                          }
                        >
                          <FaAngleLeft />
                        </button>
                        <Field
                          name="quantity"
                          type="number"
                          className="w-16 text-center"
                          value={values.quantity}
                        />
                        <button
                          type="button"
                          className="btn btn-primary text-xl"
                          onClick={() =>
                            dispatch(increaseQuantity(product._id))
                          }
                        >
                          <FaAngleRight />
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
                <div className="price flex gap-5 items-center justify-end text-end">
                  <div>
                    <h3 className="title text-2xl">
                      Rs. {formatPrice(product.finalPrice * product.quantity)}
                    </h3>
                    <div className="calc">
                      {product.quantity} X Rs. {formatPrice(product.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center text-center p-5 md:p-10">
              <img src="./empty-cart.svg" className="w-48" />
              <div className="info my-3">
                <h3 className="title text-2xl">No items in the cart</h3>
                <p className="text-gray-600 mb-3">
                  It seems you have not added any items in the cart
                </p>
                <Link to={"/products"}>
                  <button className="btn btn-primary">Find Products</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="list bg-white p-5 shadow-md rounded-md w-full md:w-1/4">
        <div className="heading">
          <h3 className="title text-2xl">Cart Total</h3>
          <hr className="my-3" />
          <div className="summary">
            <p>Total Items: {totalQuantity}</p>
            <p>Total Price: Rs. {formatPrice(totalPrice)}</p>
          </div>
          <div className="payment_method">
            <Formik
              initialValues={{ paymentMethod: "" }}
              validationSchema={paymentSchema}
              onSubmit={handleSubmit}
            >
              {({ values }) => (
                <Form className="my-3 flex flex-col gap-5">
                  <div>
                    <Field
                      as="select"
                      name="paymentMethod"
                      className="bg-transparent w-full"
                    >
                      <option value="" disabled>
                        Select Payment Method
                      </option>
                      <option value="bankTransfer">Bank Transfer</option>
                      <option value="cod">Cash on Delivery</option>
                    </Field>
                    <ErrorMessage
                      name="paymentMethod"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {values.paymentMethod === "bankTransfer" && (
                    <div className="bank-details">
                      <h4 className="font-semibold text-lg">
                        Bank Transfer Details:
                      </h4>
                      <p>Bank Name: XYZ Bank</p>
                      <p>Account Number: 1234567890</p>
                      <p>Account Holder: ABC Corp.</p>
                      <p>Branch: Kathmandu</p>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary px-5 py-2">
                    Place Order
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
