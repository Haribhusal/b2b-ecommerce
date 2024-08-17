const express = require("express");
const {
  registerSeller,
  authSeller,
  verifySeller,
  approveSeller,
  getSellers,
  getSellerById,
  updateSeller,
  deleteSeller,
  addSeller,
} = require("../controllers/sellerController");

const { protect, admin, seller } = require("../middleware/authMiddleware"); // Assuming you have middleware for auth

const router = express.Router();

router.post("/register", registerSeller);
router.get("/verify/:token", verifySeller);
router.post("/login", authSeller);

router.post("/", protect, admin, addSeller);
router.get("/", protect, admin, getSellers);
router.get("/:id", protect, admin, getSellerById);
router.put("/:id", protect, admin, updateSeller);
router.delete("/:id", protect, admin, deleteSeller);

router.put("/approve-seller/:id", protect, admin, approveSeller);

// Add other seller-related routes here

module.exports = router;
