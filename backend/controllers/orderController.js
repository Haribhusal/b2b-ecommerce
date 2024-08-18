const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;

  const user = req.user._id;
  console.log("user is", user);

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items in the order");
  }

  // Prepare the order items with product details
  const orderItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.product);

      if (!product) {
        res.status(404);
        throw new Error("Product not found");
      }

      const totalItemPrice = product.finalPrice * item.quantity;

      return {
        product: item.product,
        quantity: item.quantity,
        price: product.finalPrice,
        totalItemPrice,
      };
    })
  );

  // Calculate total items and total amount
  const totalItems = orderItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = orderItems.reduce(
    (acc, item) => acc + item.totalItemPrice,
    0
  );

  // Create the order
  const order = new Order({
    user,
    orderItems,
    totalItems,
    totalAmount,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
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
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
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
  updateOrderToDelivered,
  deleteOrder,
};
