import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneNumberRegexPattern =
  /^[+]?[\d]{0,3}[\W]?[(]?[\d]{3}[)]?[-\s.]?[\d]{3}[-\s.]?[\d]{4,6}$/im;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },

  email: {
    type: String,
    required: [true, "Please enter your email!"],
    validate: {
      validator: function (value) {
        return emailRegexPattern.test(value);
      },
      message: "Please enter a valid email",
    },
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },

  phoneNumber: {
    type: Number,
    validate: {
      validator: function (value) {
        return phoneNumberRegexPattern.test(value);
      },
      message: "Please enter a valid phone number",
    },
  },

  addresses: [
    {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
      addressType: {
        type: String,
      },
    },
  ],

  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  avatar: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Hash the password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Compare the password which is stored in mongoDB and password entered by user
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
