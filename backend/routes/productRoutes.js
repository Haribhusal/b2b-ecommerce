// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin, seller } = require("../middleware/authMiddleware"); // Assuming you have middleware for auth

router.route("/").get(getProducts);
router.route("/").post(protect, admin, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
