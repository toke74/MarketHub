//Package imports
import { combineReducers } from "@reduxjs/toolkit";

//Local imports
import authReducer from "../features/auth/authSlice"; // Import auth reducer RTK Slice
import sellerReducer from "../features/seller/sellerSlice"; // Import seller reducer RTK Slice
import { apiSlice } from "../services/apiSlice"; // Import RTK Query API slice

const rootReducer = combineReducers({
  auth: authReducer, // Manages authentication state
  seller: sellerReducer, // Manages  seller state
  [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query API reducer
});

export default rootReducer;
