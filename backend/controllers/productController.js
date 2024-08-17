const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, quantity, category, company } = req.body;

  const product = new Product({
    name,
    description,
    price,
    quantity,
    category,
    company,
    user: req.user._id, // Assuming the seller's ID is stored in req.user
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("category company"); // Populating category and company
  res.json(products);
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category company"
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, quantity, category, company } = req.body;
  console.log(req.body);
  const productId = req.params.id;

  // Find the existing product
  const product = await Product.findById(productId);


  if (product) {
    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;
    product.company = company || product.company;

    // Save the updated product
    const updatedProduct = await product.save();

    res.json({ updatedProduct, message: `Product edited by ${req.user.name}` });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
