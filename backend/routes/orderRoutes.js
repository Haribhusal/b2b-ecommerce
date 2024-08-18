const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, admin, seller } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/", protect, createOrder);
router.get("/", protect, admin, getOrders);
router.get("/:id", protect, admin, getOrderById);
router.put("/:id", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
