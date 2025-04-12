import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // Stores all products
  product: null, // Stores single product if needed
  loading: false, // Tracks loading state
  error: null, // Stores error messages
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    getProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getProductRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProductSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    getProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure,
  getProductRequest,
  getProductSuccess,
  getProductFailure,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer;
