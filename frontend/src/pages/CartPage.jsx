import { useDispatch, useSelector } from "react-redux";
import { FaAngleLeft, FaAngleRight, FaTrash } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  removeFromCart,
} from "../features/cartSlice";
import { formatPrice } from "../utils/formatPrice"; // Import the formatPrice utility

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );

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
    switch (values.paymentMethod) {
      case "esewa":
        // Handle Esewa payment
        console.log("Proceeding with Esewa payment...");
        break;
      case "khalti":
        // Handle Khalti payment
        console.log("Proceeding with Khalti payment...");
        break;
      case "bankTransfer":
        // Show bank details
        console.log("Proceeding with Bank Transfer...");
        break;
      case "cod":
        // Handle Cash on Delivery
        console.log("Proceeding with Cash on Delivery...");
        break;
      default:
        break;
    }
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
                    <FaTrash className="" />
                  </button>

                  <div className="detail">
                    <h3 className="font-semibold  text-xl">{product.name}</h3>
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
                <div className="price flex gap-5  items-center justify-end text-end">
                  <div className="">
                    <h3 className="title text-2xl">
                      Rs. {formatPrice(product.price * product.quantity)}
                    </h3>
                    <div className="calc">
                      {product.quantity} X Rs. {formatPrice(product.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No products found in the Cart</div>
          )}
        </div>
      </div>
      <div className="list bg-white  p-5 shadow-md rounded-md w-full md:w-1/4">
        <div className="heading">
          <h3 className="title text-2xl">Cart Total</h3>
          <hr className="my-3 " />
          <div className="summary">
            <p>Total Items: {totalQuantity}</p>
            <p>Total Price: {formatPrice(totalPrice)}</p>
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
                      <option value="esewa">Esewa</option>
                      <option value="khalti">Khalti</option>
                      <option value="bankTransfer">Bank Transfer</option>
                      <option value="cod">Cash on Delivery</option>
                    </Field>
                    <ErrorMessage
                      name="paymentMethod"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Conditional rendering based on payment method */}
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

                  <button type="submit" className="btn btn-primary px-5 py-3">
                    Proceed to Checkout
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
