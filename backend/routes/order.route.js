import express from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  updateVendorShippingStatus,
  updatePaymentStatus,
  getAllOrders,
  cancelOrder,
} from "../controllers/order.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
  isVendorAuthenticated,
} from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

// Create a new order
orderRouter.post("/create", isAuthenticated, createOrder);

// Get order by ID
orderRouter.get("/:id", isAuthenticated, getOrderById);

// Get all orders for a user
orderRouter.get("/myorders", isAuthenticated, getMyOrders);

// Get all orders for a vendor
orderRouter.get("/vendor", isVendorAuthenticated, getVendorOrders);

// Update order status (Admin only)
orderRouter.put(
  "/:id/status",
  isAuthenticated,
  authorizeRoles("admin"),
  updateOrderStatus
);

// Update vendor shipping status
orderRouter.put(
  "/:id/vendor-status",
  isVendorAuthenticated,
  updateVendorShippingStatus
);

// Update payment status (Admin only)
orderRouter.put(
  "/:id/payment",
  isAuthenticated,
  authorizeRoles("admin"),
  updatePaymentStatus
);

// Get all orders (Admin only)
orderRouter.get("/", isAuthenticated, authorizeRoles("admin"), getAllOrders);

// Cancel order (User)
orderRouter.put("/:id/cancel", isAuthenticated, cancelOrder);

export default orderRouter;
