// Desc: Vendor controller functions
//importing required modules
import jwt from "jsonwebtoken";

//importing Local files
import Vendor from "../model/vendor.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncErrorHandler from "../middlewares/catchAsyncErrors.js";
import { createVerifyEmailToken } from "../utils/generateTokens.js";
import sendEmail from "../utils/sendEmail.js";
import { sendTokensAsCookiesForVendor } from "../utils/sendTokensAsCookies.js";

// @desc    Register Vendor
// @route   POST /api/v1/vendor/register
// @access  Public
export const registerVendor = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    storeName,
    storeDescription,
    bankDetails,
  } = req.body;

  // Check for required fields
  if (!name || !email || !password || !phone || !address || !storeName) {
    return next(new ErrorHandler("All required fields must be filled", 400));
  }

  // Check if vendor already exists
  const existingVendor = await Vendor.findOne({ email });
  if (existingVendor) {
    return next(new ErrorHandler("Vendor with this email already exists", 400));
  }

  //Check if store name already exists
  const existingStore = await Vendor.findOne({ storeName });

  //If store name already exists, return error
  if (existingStore) {
    return next(new ErrorHandler("Store name is already taken", 400));
  }

  // Create new vendor
  const vendor = await Vendor.create({
    name,
    email,
    password,
    phone,
    address,
    storeName,
    storeDescription,
    bankDetails,
  });

  //After user created  in DB,  send activation link to user email
  const { token } = createVerifyEmailToken(vendor._id);
  const activationLink = `${process.env.CLIENT_URL}/api/v1/vendor/verify_email/${token}`;
  const message = activationLink;
  const ejsUrl = `vendor.ejs`;

  //send activation code to user email
  try {
    await sendEmail({
      email: vendor.email,
      subject: "Verify your Email",
      message,
      name: vendor.name,
      ejsUrl: ejsUrl,
    });

    //Send response to vendor
    res.status(201).json({
      success: true,
      message: `Please check your email ${vendor.email} to Verify your email!`,
      token,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// @desc    Verify  Vendor Email
// @route   GET /api/v1/vendor/verify_email/:token
// @access  Public
export const verifyVendorEmail = asyncErrorHandler(async (req, res, next) => {
  // Get token from params
  const { token } = req.params;

  // Verify the token
  const decoded = jwt.verify(token, process.env.VENDOR_ACTIVATION_SECRET);

  //  if the vendor not exists, then return error
  if (!decoded) {
    return next(new ErrorHandler("Invalid activation token", 400));
  }
  // Find the vendor by ID from the decoded token
  const vendor = await Vendor.findById(decoded.id);

  //  if the vendor not exists, then return error
  if (!vendor) {
    return next(new ErrorHandler("Invalid activation token", 400));
  }

  // Check if the vendor is already verified
  if (vendor.isEmailVerified) {
    return next(new ErrorHandler("Email is already verified", 400));
  }

  // Update the vendor's email verification status
  vendor.isEmailVerified = true;
  await vendor.save();

  // Send response to the vendor
  res.status(200).json({
    success: true,
    message: "Email verified successfully. Your account is now active.",
  });
});

// @desc    Activate Vendor by Admin
// @route   PATCH /api/v1/vendor/activate/:id
// @access  Admin
export const activateVendor = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the vendor by ID
  const vendor = await Vendor.findById(id);

  if (!vendor) {
    return next(new ErrorHandler("Vendor not found", 404));
  }

  if (vendor.isVerified) {
    return res.status(400).json({
      success: false,
      message: "Vendor is already verified.",
    });
  }

  // Update the isVerified field to true
  vendor.isVerified = true;
  await vendor.save();

  res.status(200).json({
    success: true,
    message: "Vendor has been successfully verified.",
    data: {
      id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      isVerified: vendor.isVerified,
    },
  });
});

// @desc    Login Vendor
// @route   POST /api/v1/vendor/login
// @access  Public
export const loginVendor = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  // Find vendor by email
  const vendor = await Vendor.findOne({ email }).select("+password");

  if (!vendor) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if email is verified
  if (!vendor.isEmailVerified) {
    //After user created  in DB,  send activation link to user email
    const { token } = createVerifyEmailToken(vendor._id);
    const activationLink = `${process.env.CLIENT_URL}/api/v1/vendor/verify_email/${token}`;
    const message = activationLink;
    const ejsUrl = `vendor.ejs`;

    //send activation code to user email
    try {
      await sendEmail({
        email: vendor.email,
        subject: "Verify your Email",
        message,
        name: vendor.name,
        ejsUrl: ejsUrl,
      });

      //Send response to vendor
      res.status(201).json({
        success: true,
        message: `Please check your email ${vendor.email} to Verify your email!`,
        token,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }

  // Check if the vendor is verified by admin
  if (!vendor.isVerified) {
    return next(
      new ErrorHandler(
        "Your account has not been verified by an admin yet.",
        403
      )
    );
  }

  // Check if the password matches
  const isPasswordMatch = await vendor.comparePassword(password);

  // If password does not match, return error
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //import methods to generate access Token and refresh token
  sendTokensAsCookiesForVendor(vendor._id, 200, res);
});

// @desc    Logout Vendor
// @route   GET /api/v1/vendor/logout
// @access  Private
export const logoutVendor = asyncErrorHandler(async (req, res, next) => {
  // Check if the vendor is exist
  const vendor = await Vendor.findById(req.vendor.id);

  //if vendor not exists, then return error
  if (!vendor) {
    return next(new ErrorHandler("Invalid Credential ", 401));
  }

  // Clear the refresh token and access token from cookies
  res
    .cookie("vendorAccessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(0), // Set expiry to past date
    })
    .cookie("vendorRefreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(0), // Set expiry to past date
    });

  //Send success message to client
  res.status(200).json({
    success: true,
    vendorAccessToken: "",
    message: "Logged out successfully",
  });
});

// @desc    Update Access Token
// @route   GET /api/v1/vendor/vendor_refresh_token
// @access  Public
export const updateVendorAccessToken = asyncErrorHandler(
  async (req, res, next) => {
    //Get vendor refresh token from cookies, every time client send request. the cookie send along with the request.
    const refresh_token = req.cookies.vendorRefreshToken;

    // Check whether the refresh token is empty or not
    if (!refresh_token) {
      return next(
        new ErrorHandler("Refresh token not found. Please login again.", 401)
      );
    }
    // Verify the validity of the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return next(
        new ErrorHandler("Invalid refresh token. Please login again.", 401)
      );
    }

    // If valid, find user by decoded ID from the token
    const vendor = await Vendor.findById(decoded.id);
    if (!vendor) {
      return next(
        new ErrorHandler("Vendor not found. Please login again.", 404)
      );
    }

    //Put vendor object on req.vendor for access by middleware
    req.vendor = vendor;

    //import methods to generate access Token and refresh token
    sendTokensAsCookiesForVendor(vendor._id, 200, res);
  }
);
