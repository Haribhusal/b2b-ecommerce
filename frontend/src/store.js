// src/store.js
import { configureStore } from "@reduxjs/toolkit";
// Import your reducers/slices here
import cartSlice from "./features/cartSlice";
// Import other reducers/slices as needed

const store = configureStore({
  reducer: {
    cart: cartSlice,
    // Add other reducers here
  },
});

export default store;
