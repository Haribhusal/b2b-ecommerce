const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Ticket = require("../models/Ticket");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

// @desc    Register new seller
// @route   POST /api/sellers
// @access  Public
const registerSeller = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists, Please try again with new email");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "seller",
  });

  if (user) {
    const verificationToken = user.generateVerificationToken();
    await user.save();

    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/sellers/verify/${verificationToken}`;
    const message = `Please verify your email by clicking the following link: ${verificationUrl}`;

    await sendEmail({
      to: email,
      subject: "Email Verification",
      text: message,
    });
    res.status(201).json({
      message: "Please verify your email",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Verify seller email
// @route   GET /api/sellers/verify/:token
// @access  Public
const verifySeller = asyncHandler(async (req, res) => {
  console.log(req.params.token);
  const verificationToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    verificationToken,
    isVerified: false,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({
    message: "Email verified successfully",
  });
});

// @desc    Authenticate seller & get token
// @route   POST /api/sellers/login
// @access  Public
const authSeller = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(400);
      throw new Error("Email not verified");
    }
    if (!user.isApproved) {
      res.status(403); // Forbidden
      throw new Error("Your account is not approved by the admin.");
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const approveSeller = asyncHandler(async (req, res) => {
  const sellerId = req.params.id;

  const seller = await User.findById(sellerId);

  if (seller && seller.role === "seller") {
    seller.isApproved = true;
    await seller.save();
    res.json({ message: "Seller approved successfully" });
  } else {
    res.status(404);
    throw new Error("Seller not found");
  }
});

const getSellers = asyncHandler(async (req, res) => {
  const sellers = await User.find({ role: "seller" });
  res.json(sellers);
});

const getSellerById = asyncHandler(async (req, res) => {
  const seller = await User.findById(req.params.id);
  if (seller) {
    res.json(seller);
  } else {
    res.status(404);
    throw new Error("Seller not found");
  }
});

const updateSeller = asyncHandler(async (req, res) => {
  const { name, email, role, isVerified, isApproved } = req.body;

  const seller = await User.findById(req.params.id);

  if (seller) {
    seller.name = name || seller.name;
    seller.email = email || seller.email;
    seller.role = role || seller.role;
    seller.isVerified =
      isVerified !== undefined ? isVerified : seller.isVerified;
    seller.isApproved =
      isApproved !== undefined ? isApproved : seller.isApproved;

    const updatedSeller = await seller.save();
    res.json(updatedSeller);
  } else {
    res.status(404);
    throw new Error("Seller not found");
  }
});

const deleteSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id);

  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }

  await seller.deleteOne(); // Use deleteOne instead of remove

  res.json({ message: "Seller deleted successfully" });
});
const addSeller = asyncHandler(async (req, res) => {
  const { name, email, password, role, isVerified, isApproved } = req.body;

  const sellerExists = await User.findOne({ email });
  if (sellerExists) {
    res.status(400);
    throw new Error("Seller already exists");
  }

  const seller = new User({
    name,
    email,
    password,
    role,
    isVerified,
    isApproved,
  });

  const createdSeller = await seller.save();
  res.status(201).json(createdSeller);
});

module.exports = {
  registerSeller,
  approveSeller,
  verifySeller,
  authSeller,
  getSellers,
  getSellerById,
  updateSeller,
  deleteSeller,
  addSeller,
};
