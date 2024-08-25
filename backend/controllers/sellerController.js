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

const changePassword = asyncHandler(async (req, res) => {
  console.log("here");
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  console.log("user", user);

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    message: "Password changed successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  console.log("userrr", user);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const resetToken = generateToken(user._id);
  console.log(resetToken);
  user.resetToken = resetToken;
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/sellers/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of your password. Please click the following link to complete the process: ${resetUrl}`;

  try {
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      text: message,
    });

    res.status(200).json({
      message: "Password reset email sent",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error("Email could not be sent");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  res.status(200).json({
    message: "Password reset successful",
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
      role: user.role,
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
  const seller = await User.findById(req.params.id);

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
  changePassword,
  forgotPassword,
  resetPassword,
};
