const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const cloudinary = require("./../config/cloudinary");

// Assuming you have a function to get subcategories

const productController = {
  createProduct: asyncHandler(async (req, res) => {
    const {
      name,
      description,
      price,
      quantity,
      discountType,
      discountValue,
      category,
      company,
      minimumOrder,
    } = req.body;

    const images = req.files || [];
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "products",
        });
        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      })
    );

    const product = new Product({
      name,
      description,
      price,
      quantity,
      discountType,
      discountValue,
      category,
      company,
      user: req.user._id,
      images: uploadedImages,
      minimumOrder: minimumOrder || 1, // Set minimumOrder, default to 1 if not provided
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  }),

  getProducts: asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate("category company");
    res.json(products);
  }),

  getProductById: asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      "category company"
    );

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(product);
  }),
  updateProduct: asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Handle new images
    const newImages = req.files || [];
    const uploadedNewImages = await Promise.all(
      newImages.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "products",
        });
        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      })
    );

    // Handle existing images
    const existingImages = req.body.existingImages || [];
    const imagesToKeep = product.images.filter((image) =>
      existingImages.includes(image.url)
    );
    const imagesToDelete = product.images.filter(
      (image) => !existingImages.includes(image.url)
    );

    // Delete removed images from Cloudinary
    await Promise.all(
      imagesToDelete.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      })
    );

    // Update product fields
    Object.assign(product, req.body);

    // Update images
    product.images = [...imagesToKeep, ...uploadedNewImages];

    const updatedProduct = await product.save();
    res.json({ updatedProduct, message: `Product edited by ${req.user.name}` });
  }),
  deleteProduct: asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (image) => {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        })
      );
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProductId: productId,
    });
  }),
  searchProducts: asyncHandler(async (req, res) => {
    const {
      searchTerm,
      category,
      minPrice,
      maxPrice,
      sortBy,
      order = "asc",
    } = req.query;

    const query = {};
    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice) {
      query.price = { $gte: minPrice };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: maxPrice };
    }

    const sortOptions = sortBy ? { [sortBy]: order === "asc" ? 1 : -1 } : {};
    const products = await Product.find(query)
      .sort(sortOptions)
      .populate("category");
    res.json(products);
  }),

  // Fetch products by category ID (including subcategories)
  fetchProductsByCategory: asyncHandler(async (req, res) => {
    const categoryId = req.query.category || req.params.id;

    const getAllSubcategories = async (categoryId) => {
      const subcategories = await Category.find({ parent: categoryId });
      let allSubcategories = subcategories.map((cat) => cat._id);

      for (const subcategory of subcategories) {
        const childSubcategories = await getAllSubcategories(subcategory._id);
        allSubcategories = allSubcategories.concat(childSubcategories);
      }

      return allSubcategories;
    };

    // Get all subcategories
    const subcategories = await getAllSubcategories(categoryId);
    subcategories.push(categoryId); // Include the selected category itself
    const products = await Product.find({
      category: { $in: subcategories },
    }).populate("category");

    res.json(products);
  }),
};

module.exports = productController;
