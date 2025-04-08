//Package import
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

//Local imports
import rootReducer from "./rootReducer"; // Import rootReducer
import { apiSlice } from "../services/apiSlice"; // Import RTK Query API

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Persist only auth slice
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),

  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development mode
});

setupListeners(store.dispatch); // Enables automatic refetching when online

export default store;

export const persistor = persistStore(store);
