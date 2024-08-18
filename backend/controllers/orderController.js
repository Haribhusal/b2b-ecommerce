const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

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

    // Respond with the created order
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
  const orders = await Order.find({}).populate("user", "id name email");
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

  try {
    const updatedOrder = await updateOrderById({
      id: req.params.id,
      status,
    });

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

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
