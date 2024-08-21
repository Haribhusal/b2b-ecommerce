const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
    },
    description: {
      type: String,
      required: [true, "Please add a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a product price"],
      min: [0, "Price cannot be less than zero"],
    },
    discountType: {
      type: String,
      enum: ["flat", "percentage", null],
      default: null,
    },
    discountValue: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Please add a product quantity"],
      min: [0, "Quantity cannot be less than zero"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Path `category` is required."],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to the Company model
      required: [true, "Path `company` is required."],
    },
    finalPrice: {
      type: Number,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.discountType === "flat") {
    this.finalPrice = Math.max(this.price - this.discountValue, 0);
  } else if (this.discountType === "percentage") {
    this.finalPrice = this.price - (this.price * this.discountValue) / 100;
  } else {
    this.finalPrice = this.price;
  }

  // Ensure finalPrice does not go below 0
  this.finalPrice = Math.max(Math.round(this.finalPrice), 0);

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
