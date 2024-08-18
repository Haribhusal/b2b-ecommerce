const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }, // Product price at the time of order
      totalItemPrice: { type: Number, required: true }, // price * quantity
    },
  ],
  totalAmount: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "canceled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Middleware to calculate total items and total amount
orderSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.totalItemPrice,
    0
  );
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
