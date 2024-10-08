// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  fetchProductsByCategory,
} = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

const { protect, admin, seller } = require("../middleware/authMiddleware"); // Assuming you have middleware for auth

router.route("/").get(getProducts);
router.route("/search").get(searchProducts);
router.route("/filter").get(fetchProductsByCategory);
router
  .route("/")
  .post(protect, admin, upload.array("images", 5), createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.array("images", 5), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
