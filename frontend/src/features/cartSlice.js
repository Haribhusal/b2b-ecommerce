// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        // If the item already exists in the cart
        if (existingItem.quantity + 1 >= item.minimumOrder) {
          // Check if adding one more quantity will exceed the minimum order
          existingItem.quantity += 1; // Increment quantity
          state.totalQuantity += 1; // Update total quantity
          state.totalPrice += item.finalPrice; // Update total price
        } else {
          // If adding one more quantity will not meet the minimum order
          existingItem.quantity = item.minimumOrder; // Set quantity to minimum order
          state.totalQuantity += item.minimumOrder - existingItem.quantity; // Update total quantity
          state.totalPrice +=
            (item.minimumOrder - existingItem.quantity) * item.finalPrice; // Update total price
        }
      } else {
        // If the item doesn't exist in the cart
        state.cartItems.push({ ...item, quantity: item.minimumOrder }); // Add new item with minimum order quantity
        state.totalQuantity += item.minimumOrder; // Update total quantity
        state.totalPrice += item.minimumOrder * item.finalPrice; // Update total price
      }
    },

    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find(
        (cartItem) => cartItem._id === productId
      );

      if (item) {
        // Check if increasing the quantity will meet the minimum order
        if (item.quantity + 1 >= item.minimumOrder) {
          item.quantity += 1; // Increment quantity
          state.totalQuantity += 1; // Update total quantity
          state.totalPrice += item.finalPrice; // Update total price
        }
      }
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find(
        (cartItem) => cartItem._id === productId
      );

      if (item && item.quantity > item.minimumOrder) {
        // Only decrease if quantity is greater than minimum order
        item.quantity -= 1; // Decrement quantity
        state.totalQuantity -= 1; // Update total quantity
        state.totalPrice -= item.finalPrice; // Update total price
      }
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );

      if (itemIndex >= 0) {
        const item = state.cartItems[itemIndex];
        state.totalQuantity -= item.quantity; // Decrease total quantity
        state.totalPrice -= item.finalPrice * item.quantity; // Decrease total price
        state.cartItems.splice(itemIndex, 1); // Remove item from cart
      }
    },
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find(
        (cartItem) => cartItem._id === productId
      );

      if (item) {
        if (quantity < item.minimumOrder) {
          // If the new quantity is less than minimumOrder, set to minimumOrder
          state.totalQuantity += item.minimumOrder - item.quantity; // Adjust total quantity
          state.totalPrice +=
            (item.minimumOrder - item.quantity) * item.finalPrice; // Adjust total price
          item.quantity = item.minimumOrder; // Set quantity to minimumOrder
        } else {
          // Update total quantity and price based on the new quantity
          state.totalQuantity += quantity - item.quantity; // Update total quantity
          state.totalPrice += (quantity - item.quantity) * item.finalPrice; // Update total price
          item.quantity = quantity; // Set new quantity
        }
      }
    },
    clearCart: (state) => {
      state.cartItems = []; // Clear cart items
      state.totalQuantity = 0; // Reset quantity
      state.totalPrice = 0; // Reset price
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
