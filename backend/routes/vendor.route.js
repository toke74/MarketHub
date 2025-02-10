import express from "express";
import {
  registerVendor,
  verifyVendorEmail,
} from "../controllers/vendor.controller.js";

const vendorRouter = express.Router();

// Create Vendor route
vendorRouter.post("/register", registerVendor);

// Verify  Vendor Email route
vendorRouter.get("/verify_email/:token", verifyVendorEmail);

export default vendorRouter;
