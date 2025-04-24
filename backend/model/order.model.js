import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for an order"],
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vendor",
          required: [true, "Vendor is required"],
        },
        name: {
          type: String,
          required: [true, "Product name is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price cannot be negative"],
        },
        discountPrice: {
          type: Number,
          default: 0,
          min: [0, "Discount price cannot be negative"],
        },
        image: {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
        variation: {
          color: { type: String },
          size: { type: String },
        },
      },
    ],
    shippingAddress: {
      street: { type: String, required: [true, "Street is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String },
      country: { type: String, required: [true, "Country is required"] },
      zipCode: { type: String },
      addressType: {
        type: String,
        default: "Other",
        enum: ["Default", "Other"],
      },
    },
    paymentInfo: {
      method: {
        type: String,
        required: [true, "Payment method is required"],
        enum: ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery"],
      },
      status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Completed", "Failed"],
      },
      transactionId: {
        type: String,
      },
    },
    orderStatus: {
      type: String,
      default: "Processing",
      enum: [
        "Processing",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
    },
    vendors: [
      {
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vendor",
          required: [true, "Vendor is required"],
        },
        items: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: [true, "Product is required"],
            },
            quantity: {
              type: Number,
              required: [true, "Quantity is required"],
            },
          },
        ],
        subTotal: {
          type: Number,
          required: [true, "Subtotal is required"],
          min: [0, "Subtotal cannot be negative"],
        },
        shippingStatus: {
          type: String,
          default: "Processing",
          enum: [
            "Processing",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Returned",
          ],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, "Shipping cost cannot be negative"],
    },
    discountApplied: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    finalPrice: {
      type: Number,
      required: [true, "Final price is required"],
      min: [0, "Final price cannot be negative"],
    },
    orderNotes: {
      type: String,
      maxlength: [500, "Order notes cannot exceed 500 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Middleware to calculate totalPrice, discountApplied, and finalPrice
orderSchema.pre("save", async function (next) {
  let total = 0;
  let discount = 0;

  // Calculate subtotal for each vendor
  for (let vendor of this.vendors) {
    let vendorSubTotal = 0;
    for (let item of vendor.items) {
      const product = await mongoose.model("Product").findById(item.product);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      const itemPrice = product.discountPrice || product.price;
      vendorSubTotal += itemPrice * item.quantity;
    }
    vendor.subTotal = vendorSubTotal;
    total += vendorSubTotal;
  }

  // Calculate total discount
  for (let item of this.orderItems) {
    const product = await mongoose.model("Product").findById(item.product);
    if (product.discountPrice && product.discountPrice < product.price) {
      discount += (product.price - product.discountPrice) * item.quantity;
    }
  }

  this.totalPrice = total;
  this.discountApplied = discount;
  this.finalPrice = this.totalPrice + this.shippingCost - this.discountApplied;

  next();
});

// Middleware to update product stock and soldOut on order creation
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    for (let item of this.orderItems) {
      const product = await mongoose.model("Product").findById(item.product);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      product.stock -= item.quantity;
      product.soldOut += item.quantity;
      await product.save();
    }
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
