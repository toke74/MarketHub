import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Stores user details
  isAuthenticated: false, // Tracks login status
  loading: false, // Tracks API request status
  error: null, // Stores errors,
  activationToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    activateToken: (state, action) => {
      state.loading = false;
      state.activationToken = action.payload;
      state.isAuthenticated = false;
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
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  activateToken,
  loadUserRequest,
  loadUserSuccess,
  loadUserFailure,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
