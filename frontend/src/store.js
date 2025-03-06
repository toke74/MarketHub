import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import rootReducer from "./rootReducer"; // Import rootReducer
import { apiSlice } from "./services/api/apiSlice"; // Import RTK Query API

const store = configureStore({
  reducer: rootReducer, // Combines all slices
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development mode
});

setupListeners(store.dispatch); // Enables automatic refetching when online

export default store;
