import express from "express";
import {
  registerVendor,
  verifyVendorEmail,
  activateVendor,
  loginVendor,
  logoutVendor,
  updateVendorAccessToken,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateStoreAvatar,
  updateStoreImage,
  getVendorInfo,
  updateVendorProfile,
  updateVendorAddress,
} from "../controllers/vendor.controller.js";

import {
  authorizeRoles,
  isAuthenticated,
  isVendorAuthenticated,
} from "../middlewares/authMiddleware.js";

import {
  uploadStoreAvatar,
  uploadStoreImage,
} from "../middlewares/fileUploadMiddleware.js";
const vendorRouter = express.Router();

// Create Vendor route
vendorRouter.post("/register", registerVendor);

// Verify  Vendor Email route
vendorRouter.get("/verify_email/:token", verifyVendorEmail);

// Admin route to activate vendor
vendorRouter.patch(
  "/activate/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  activateVendor
);

// Login Vendor route
vendorRouter.post("/login", loginVendor);

// Logout Vendor route
vendorRouter.get("/logout", isVendorAuthenticated, logoutVendor);

// Login Vendor route
vendorRouter.get("/vendor_refresh_token", updateVendorAccessToken);

//Vendor Forgot Password  route
vendorRouter.post("/forgot_password", forgotPassword);

//Vendor Reset Password  route
vendorRouter.post("/reset_password/:resetToken", resetPassword);

// update Password route
vendorRouter.put("/update_password", isVendorAuthenticated, updatePassword);

// update store Avatar route
vendorRouter.post(
  "/update_store_avatar",
  isVendorAuthenticated,
  uploadStoreAvatar,
  updateStoreAvatar
);

// update store Image route
vendorRouter.post(
  "/update_store_image",
  isVendorAuthenticated,
  uploadStoreImage,
  updateStoreImage
);

// Get Vendor Profile route
vendorRouter.get("/me", isVendorAuthenticated, getVendorInfo);

// Update Vendor profile route
vendorRouter.patch(
  "/update_profile",
  isVendorAuthenticated,
  updateVendorProfile
);

// Update Vendor address route
vendorRouter.patch(
  "/update_address",
  isVendorAuthenticated,
  updateVendorAddress
);

export default vendorRouter;
