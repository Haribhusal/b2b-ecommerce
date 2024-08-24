const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    tickets: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        images: [
          {
            url: { type: String, required: true },
          },
        ],
      },
    ],
    totalItems: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

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
