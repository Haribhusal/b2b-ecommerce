const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const cloudinary = require("./../config/cloudinary");

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      discountType,
      discountValue,
      category,
      company,
    } = req.body;
    const images = req.files; // assuming images are being uploaded via a form with 'multipart/form-data'
    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "products",
        });
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const product = new Product({
      name,
      description,
      price,
      quantity,
      discountType,
      discountValue,
      category,
      company,
      user: req.user._id, // Assuming the seller's ID is stored in req.user
      images: uploadedImages,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.log("error in backend while adding an product", error);
  }
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
  const {
    name,
    description,
    price,
    quantity,
    discountType,
    discountValue,
    category,
    company,
  } = req.body;
  const productId = req.params.id;

  // Find the existing product
  const product = await Product.findById(productId);

  if (product) {
    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountType = discountType || product.discountType;
    product.discountValue = discountValue || product.discountValue;
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
    // Delete images from Cloudinary
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const {
      searchTerm,
      category,
      minPrice,
      maxPrice,
      sortBy,
      order = "asc",
    } = req.query;

    // Build the search query
    let query = {};

    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      query.category = category; // This should be the correct category ID
    }
    if (minPrice) {
      query.finalPrice = { $gte: minPrice };
    }
    if (maxPrice) {
      query.finalPrice = { ...query.finalPrice, $lte: maxPrice };
    }

    // Sort options
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    }

    // Execute the query with filters and sorting
    const products = await Product.find(query).sort(sortOptions);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch products by category ID, including subcategories
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  try {
    // Find the selected category
    const selectedCategory = await Category.findById(category);
    if (!selectedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find all subcategories of the selected category
    const categories = await Category.find({
      $or: [{ _id: category }, { parent: category }],
    }).select("_id");

    const categoryIds = categories.map((cat) => cat._id);

    // Find products that belong to the selected category or its subcategories
    const products = await Product.find({
      category: { $in: categoryIds },
    }).populate("category company");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
};
