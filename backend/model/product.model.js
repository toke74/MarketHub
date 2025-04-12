import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price; // Discount price must be less than the original price
        },
        message: "Discount price must be less than the original price",
      },
    },
    discountInPercent: {
      type: Number,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
    },
    badgeNew: {
      type: String,
      default: "",
    },
    badgeSale: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    soldOut: {
      type: Number,
      default: 0,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor is required"],
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    variations: [
      {
        color: { type: String },
        size: { type: String },
        quantity: {
          type: Number,
          // required: [true, "Quantity is required for variation"],
          min: [0, "Quantity cannot be negative"],
        },
      },
    ],
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Ratings cannot be less than 0"],
      max: [5, "Ratings cannot exceed 5"],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: { type: String, required: true },
        rating: {
          type: Number,
          required: true,
          min: [0, "Rating cannot be less than 0"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Middleware 2: Calculate  soldOut
productSchema.pre("save", async function (next) {
  // Only run for existing products (not new ones)
  if (!this.isNew) {
    const existingProduct = await this.constructor.findById(this._id);
    if (existingProduct) {
      const previousStock = existingProduct.stock;
      const currentStock = this.stock;

      // Calculate how many items were sold
      const soldCount = previousStock - currentStock;

      // If positive, update soldOut count
      if (soldCount > 0) {
        this.soldOut = existingProduct.soldOut + soldCount;
      } else {
        this.soldOut = existingProduct.soldOut; // no change or restock
      }
    }
  } else {
    // On new product creation, initialize soldOut to 0
    this.soldOut = 0;
  }

  next();
});

// Middleware 2: Calculate discount percentage
productSchema.pre("save", function (next) {
  if (this.discountInPercent && this.price > 0) {
    this.discountPrice =
      this.price - Math.round((this.price * this.discountInPercent) / 100);
  } else {
    this.discountPrice = 0;
  }

  next();
});
const Product = mongoose.model("Product", productSchema);

// Export the Product model
export default Product;
