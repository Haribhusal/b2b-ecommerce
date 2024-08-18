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
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }
      state.totalQuantity += 1;
      state.totalPrice += item.finalPrice;
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );
      if (itemIndex >= 0) {
        state.totalQuantity -= state.cartItems[itemIndex].quantity;
        state.totalPrice -=
          state.cartItems[itemIndex].finalPrice *
          state.cartItems[itemIndex].quantity;
        state.cartItems.splice(itemIndex, 1);
      }
    },
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find(
        (cartItem) => cartItem._id === productId
      );
      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += item.finalPrice;
      }
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find(
        (cartItem) => cartItem._id === productId
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= item.finalPrice;
      }
    },
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find(
        (cartItem) => cartItem._id === productId
      );
      if (item) {
        state.totalQuantity += quantity - item.quantity;
        state.totalPrice += (quantity - item.quantity) * item.finalPrice;
        item.quantity = quantity;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
