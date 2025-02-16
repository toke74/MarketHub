import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Vendor email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Vendor password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Ensures password is not returned in queries
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10,15}$/, "Please add a valid phone number"], // Supports 10-15 digit numbers
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      zipCode: { type: String },
    },
    storeName: {
      type: String,
      required: [true, "Store name is required"],
      unique: true,
    },
    storeDescription: {
      type: String,
      default: null,
      maxlength: [500, "Store description cannot exceed 500 characters"],
    },
    storeAvatar: {
      public_id: {
        type: String,
        default: "storeAvatar",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/shalpeace/image/upload/v1738422245/storeAvatar.jpg",
      },
    },
    storeImage: {
      public_id: {
        type: String,
        default: "default_store_image",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/shalpeace/image/upload/v1738422246/images_1_imoke7.jpg",
      },
    },
    bankDetails: {
      accountHolderName: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Vendor should be verified by admin
    },
    isEmailVerified: {
      type: Boolean,
      default: false, // Vendor should be verified by email
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot exceed 5"],
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    role: {
      type: String,
      default: "vendor",
      enum: ["vendor"],
    },
    socialLinks: {
      facebook: { type: String, default: null },
      twitter: { type: String, default: null },
      instagram: { type: String, default: null },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Middleware to hash password before saving the vendor
vendorSchema.pre("save", async function (next) {
  // Only hash the password if it's new or being modified
  if (!this.isModified("password")) {
    return next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

//Compare the password which is stored in mongoDB and password entered by Vendor
vendorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Vendor", vendorSchema);
