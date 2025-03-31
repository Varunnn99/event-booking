import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], 
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      //console.log("Adding event to cart:", event);

      const event = action.payload;
      const existingEvent = state.items.find((item) => item.id === event.id);

      console.log("Adding event to cart:", event);

      if (!existingEvent) {
        state.items.push(event);
        state.totalAmount += Number(event.price);
      }
    },
    removeFromCart: (state, action) => {
      const eventId = action.payload;
      const event = state.items.find((item) => item.id === eventId);

      if (event) {
        state.totalAmount -= event.price;
        state.items = state.items.filter((item) => item.id !== eventId);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
