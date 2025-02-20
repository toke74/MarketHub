import express from "express";
import {
  createProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { isVendorAuthenticated } from "../middlewares/authMiddleware.js";
import { uploadProductImages } from "../middlewares/fileUploadMiddleware.js";

const productRouter = express.Router();

// Create Product route
productRouter.post(
  "/create_product",
  isVendorAuthenticated,
  uploadProductImages,
  createProduct
);

// Update Product route
productRouter.put(
  "/update_product/:id",
  isVendorAuthenticated,
  uploadProductImages,
  updateProduct
);

export default productRouter;
