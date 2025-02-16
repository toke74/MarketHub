import express from "express";
import {
  registerVendor,
  verifyVendorEmail,
  activateVendor,
  loginVendor,
  logoutVendor,
} from "../controllers/vendor.controller.js";

import {
  authorizeRoles,
  isAuthenticated,
  isVendorAuthenticated,
} from "../middlewares/authMiddleware.js";

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

export default vendorRouter;
