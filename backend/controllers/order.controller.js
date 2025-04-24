import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    orderNotes,
    shippingCost,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  // Group items by vendor
  const vendorMap = new Map();
  for (const item of orderItems) {
    const product = await Product.findById(item.product).populate("vendor");
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.product} not found`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for product ${product.name}`);
    }

    const vendorId = product.vendor._id.toString();
    if (!vendorMap.has(vendorId)) {
      vendorMap.set(vendorId, {
        vendor: product.vendor._id,
        items: [],
        subTotal: 0,
      });
    }

    const vendorData = vendorMap.get(vendorId);
    vendorData.items.push({
      product: item.product,
      quantity: item.quantity,
    });

    const itemPrice = product.discountPrice || product.price;
    vendorData.subTotal += itemPrice * item.quantity;
  }

  // Prepare order items
  const formattedOrderItems = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      return {
        product: item.product,
        vendor: product.vendor,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        image: product.images[0],
        variation: item.variation || {},
      };
    })
  );

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems: formattedOrderItems,
    shippingAddress,
    paymentInfo: {
      method: paymentMethod,
    },
    vendors: Array.from(vendorMap.values()),
    shippingCost: shippingCost || 0,
    orderNotes,
  });

  // Update vendor total revenue
  for (const vendor of order.vendors) {
    await Vendor.findByIdAndUpdate(vendor.vendor, {
      $inc: { totalRevenue: vendor.subTotal },
    });
  }

  res.status(201).json(order);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product")
    .populate("orderItems.vendor", "name storeName");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if user is authorized to view the order
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json(order);
});

// @desc    Get all orders for a user
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product", "name images")
    .populate("orderItems.vendor", "storeName")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Get all orders for a vendor
// @route   GET /api/orders/vendor
// @access  Private/Vendor
const getVendorOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    "vendors.vendor": req.user._id,
  })
    .populate("user", "name email")
    .populate("orderItems.product", "name images")
    .sort({ createdAt: -1 });

  // Filter orders to only include vendor's items
  const vendorOrders = orders.map((order) => {
    const vendorData = order.vendors.find(
      (v) => v.vendor.toString() === req.user._id.toString()
    );
    return {
      ...order.toObject(),
      vendors: [vendorData],
      orderItems: order.orderItems.filter(
        (item) => item.vendor.toString() === req.user._id.toString()
      ),
    };
  });

  res.json(vendorOrders);
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (
    ![
      "Processing",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ].includes(status)
  ) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  order.orderStatus = status;
  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  } else if (status === "Cancelled") {
    order.cancelledAt = Date.now();
    // Restore stock for cancelled orders
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldOut: -item.quantity },
      });
    }
  }

  await order.save();
  res.json(order);
});

// @desc    Update vendor shipping status
// @route   PUT /api/orders/:id/vendor-status
// @access  Private/Vendor
const updateVendorShippingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const vendorData = order.vendors.find(
    (v) => v.vendor.toString() === req.user._id.toString()
  );

  if (!vendorData) {
    res.status(403);
    throw new Error("Vendor not associated with this order");
  }

  if (
    ![
      "Processing",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ].includes(status)
  ) {
    res.status(400);
    throw new Error("Invalid shipping status");
  }

  vendorData.shippingStatus = status;

  // Update main order status if all vendors are in final states
  const allVendorsFinal = order.vendors.every((v) =>
    ["Delivered", "Cancelled", "Returned"].includes(v.shippingStatus)
  );

  if (allVendorsFinal) {
    const allDelivered = order.vendors.every(
      (v) => v.shippingStatus === "Delivered"
    );
    const anyCancelled = order.vendors.some(
      (v) => v.shippingStatus === "Cancelled"
    );
    const anyReturned = order.vendors.some(
      (v) => v.shippingStatus === "Returned"
    );

    if (allDelivered) {
      order.orderStatus = "Delivered";
      order.deliveredAt = Date.now();
    } else if (anyCancelled) {
      order.orderStatus = "Cancelled";
      order.cancelledAt = Date.now();
    } else if (anyReturned) {
      order.orderStatus = "Returned";
    }
  }

  await order.save();
  res.json(order);
});

// @desc    Update payment status (Admin)
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status, transactionId } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!["Pending", "Completed", "Failed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid payment status");
  }

  order.paymentInfo.status = status;
  if (transactionId) {
    order.paymentInfo.transactionId = transactionId;
  }
  await order.save();
  res.json(order);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .populate("orderItems.product", "name images")
    .populate("orderItems.vendor", "storeName")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Cancel order (User)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this order");
  }

  if (order.orderStatus === "Delivered" || order.orderStatus === "Cancelled") {
    res.status(400);
    throw new Error("Order cannot be cancelled");
  }

  order.orderStatus = "Cancelled";
  order.cancelledAt = Date.now();
  order.vendors.forEach((vendor) => {
    vendor.shippingStatus = "Cancelled";
  });

  // Restore stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, soldOut: -item.quantity },
    });
  }

  await order.save();
  res.json(order);
});

export {
  createOrder,
  getOrderById,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  updateVendorShippingStatus,
  updatePaymentStatus,
  getAllOrders,
  cancelOrder,
};
