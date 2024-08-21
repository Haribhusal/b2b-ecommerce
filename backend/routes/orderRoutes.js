const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrdersBySeller,
  updateOrderBySeller,
} = require("../controllers/orderController");
const { protect, admin, seller } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/", protect, createOrder);
router.get("/", protect, admin, getOrders);
router.get("/seller", protect, seller, getOrdersBySeller);
router.put("/seller/:id", protect, seller, updateOrderBySeller);
router.get("/:id", protect, getOrderById);
router.put("/:id", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
