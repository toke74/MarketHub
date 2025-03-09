import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"; // Import auth reducer RTK Slice
import { apiSlice } from "../services/apiSlice"; // Import RTK Query API slice

const rootReducer = combineReducers({
  auth: authReducer, // Manages authentication state
  [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query API reducer
});

export default rootReducer;
