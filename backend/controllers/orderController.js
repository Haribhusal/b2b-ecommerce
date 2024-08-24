const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/email");

const orderController = {
  createOrder: asyncHandler(async (req, res) => {
    const { items, totalItems, totalPrice, paymentMethod, images } = req.body;
    const user = req.user?._id;

    if (!user || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const order = await Order.create({
      user,
      items,
      totalItems,
      images,
      totalPrice,
      paymentMethod,
    });

    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
           <td>${item.images[0].url}</td>
           <td>${item.name}</td>
           <td>${item.quantity}</td>
           <td>Rs. ${item.price}</td>
         </tr>`
      )
      .join("");

    // await sendEmail({
    //   from: process.env.EMAIL_USER,
    //   to: req.user.email,
    //   subject: "Order Placed Successfully",
    //   text: "Hello, your order has been placed successfully.",
    //   html: `<h1>Order Confirmation</h1>
    //          <p>Thank you for your order. Here are the details:</p>
    //          <table border="1" style="width:100%; text-align: left; border: 1px solid black; border-collapse: collapse;">
    //            <thead>
    //              <tr>
    //                <th>Image</th>
    //                <th>Item</th>
    //                <th>Quantity</th>
    //                <th>Price</th>
    //              </tr>
    //            </thead>
    //            <tbody>
    //              ${itemsHtml}
    //            </tbody>
    //          </table>
    //          <p><strong>Total Items:</strong> ${totalItems}</p>
    //          <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
    //          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
    //          <p>We will notify you once your order is approved.</p>`,
    // });

    res.status(201).json({ message: "Order created successfully", order });
  }),

  getOrders: asyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  }),

  getOrderById: asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "id name email"
    );

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.json(order);
  }),

  updateOrderStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.status = status;

    if (status === "Accepted") {
      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (product) {
          product.quantity -= item.quantity;
          await product.save();
        }
      }
    }

    const updatedOrder = await order.save();

    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr>
           <td>${item.name}</td>
           <td>${item.quantity}</td>
           <td>Rs. ${item.price}</td>
         </tr>`
      )
      .join("");

    // await sendEmail({
    //   from: process.env.EMAIL_USER,
    //   to: req.user.email,
    //   subject: `Order ${status} Successfully`,
    //   text: `Hello, your order has been ${status}.`,
    //   html: `<h1>Order ${status}</h1>
    //          <p>Your order has been verified by the Admin and ${status} your order. According to your order, the products you have requrested are:</p>
    //          <table border="1" style="width:100%; text-align: left; border: 1px solid black; border-collapse: collapse;">
    //            <thead>
    //              <tr>
    //                <th>Item</th>
    //                <th>Quantity</th>
    //                <th>Price</th>
    //              </tr>
    //            </thead>
    //            <tbody>
    //              ${itemsHtml}
    //            </tbody>
    //          </table>
    //          <p><strong>Total Items:</strong> ${order.totalItems}</p>
    //          <p><strong>Total Price:</strong> Rs. ${order.totalPrice}</p>
    //          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    //          <p>We will be in touch with you. </p>`,
    // });

    res.json(updatedOrder);
  }),

  deleteOrder: asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  }),

  getOrdersBySeller: asyncHandler(async (req, res) => {
    const sellerId = req.user._id;
    const orders = await Order.find({ user: sellerId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  }),

  updateOrderBySeller: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sellerId = req.user._id;
    const order = await Order.findOne({ _id: id, seller: sellerId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    Object.assign(order, req.body);
    await order.save();

    res.json(order);
  }),
};

module.exports = orderController;
