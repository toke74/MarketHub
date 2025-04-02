import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  seller: null, // Stores seller details
  isSellerAuthenticated: false, // Tracks login status
  loading: false, // Tracks API request status
  error: null, // Stores errors,
  sellerActivationToken: null,
};

const sellerSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    activateSellerToken: (state, action) => {
      state.loading = false;
      state.sellerActivationToken = action.payload;
      state.isSellerAuthenticated = false;
    },
    loadUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loadUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  activateSellerToken,
  loadUserRequest,
  loadUserSuccess,
  loadUserFailure,
  logout,
} = sellerSlice.actions;
export default sellerSlice.reducer;
