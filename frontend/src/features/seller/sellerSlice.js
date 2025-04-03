import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  seller: null, // Stores seller details
  isSellerAuthenticated: false, // Tracks login status
  loading: false, // Tracks API request status
  error: null, // Stores errors,
};

const sellerSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadSellerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadSellerSuccess: (state, action) => {
      state.loading = false;
      state.seller = action.payload;
      state.isSellerAuthenticated = true;
    },
    loadSellerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.seller = null;
      state.isSellerAuthenticated = false;
    },

    logout: (state) => {
      state.seller = null;
      state.isSellerAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  loadSellerRequest,
  loadSellerSuccess,
  loadSellerFailure,
  logout,
} = sellerSlice.actions;
export default sellerSlice.reducer;
