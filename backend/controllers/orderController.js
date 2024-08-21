const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/email");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized or user ID missing" });
    }

    const { items, totalItems, totalPrice, paymentMethod } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Order items are required" });
    }

    // Create a new order object
    const newOrder = {
      user: req.user._id,
      items, // Directly include the items in the order object
      totalItems,
      totalPrice,
      paymentMethod,
    };

    // Save the new order to the database
    const order = await Order.create(newOrder);

    // Generate HTML for items
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
         <td>${item.name}</td>
         <td>${item.quantity}</td>
         <td>Rs. ${item.price}</td>
       </tr>`
      )
      .join("");

    // Respond with the created order
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

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "id name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin

const updateOrderById = async ({ id, status, ...orderData }) => {
  const order = await Order.findById(id);

  if (!order) {
    throw new Error("Order not found");
  }

  if (status) {
    order.status = status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
  }

  // Update other fields if needed
  Object.assign(order, orderData);

  const updatedOrder = await order.save();
  return updatedOrder;
};

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  try {
    const updatedOrder = await updateOrderById({
      id: req.params.id,
      status,
    });

    const itemsHtml = order?.items
      .map(
        (item) =>
          `<tr>
         <td>${item.name}</td>
         <td>${item.quantity}</td>
         <td>Rs. ${item.price}</td>
       </tr>`
      )
      .join("");

    // Respond with the created order
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
  } catch (error) {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const getOrdersBySeller = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ user: sellerId }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateOrderBySeller = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;
    const order = await Order.findOne({ _id: id, seller: sellerId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    Object.assign(order, req.body);
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrdersBySeller,
  updateOrderBySeller,
};
