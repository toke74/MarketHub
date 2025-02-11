import express from "express";
import {
  registerVendor,
  verifyVendorEmail,
  activateVendor,
} from "../controllers/vendor.controller.js";

import {
  authorizeRoles,
  isAuthenticated,
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

export default vendorRouter;
