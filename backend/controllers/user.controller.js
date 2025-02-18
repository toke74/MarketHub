//import modules
import jwt from "jsonwebtoken";
import crypto from "crypto";

//import local files
import User from "../model/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncErrorHandler from "../middlewares/catchAsyncErrors.js";
import { createActivationToken } from "../utils/generateTokens.js";
import sendEmail from "../utils/sendEmail.js";
import { sendTokensAsCookies } from "../utils/sendTokensAsCookies.js";
import cloudinary from "../config/cloudinary.config.js";

// @desc    Register user
// @route   POST /api/v1/user/register
// @access  Public
export const registerUser = asyncErrorHandler(async (req, res, next) => {
  //get user email, password and name from req.body
  const { name, email, password } = req.body;

  //check if the use exist in database
  const isUserExist = await User.findOne({ email });

  //if it exist throw error back to user
  if (isUserExist) {
    return next(new ErrorHandler(`User already exists`, 400));
  }

  //if not exist save the user to database
  const user = await User.create({
    name,
    email,
    password,
  });

  //After user created  in DB,  send activation link to user email
  const activationToken = createActivationToken(user._id);
  const activationCode = activationToken.ActivationCode;
  const message = activationCode;
  const ejsUrl = `welcome.ejs`;

  //send activation code to user email
  try {
    await sendEmail({
      email: user.email,
      subject: "Activate your account",
      message,
      name,
      ejsUrl,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email ${user.email} to activate your account!`,
      activationToken: activationToken.token,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// @desc    Activate user
// @route   POST /api/v1/user/activate_user
// @access  Public
export const activateUser = asyncErrorHandler(async (req, res, next) => {
  const { activation_token, activation_code } = req.body;

  //verify toke
  const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

  // if activation code not valid, throw error
  if (activation_code !== decoded.ActivationCode) {
    return next(new ErrorHandler("Invalid activation code", 400));
  }

  //if activation code is valid, find user
  const isUserExist = await User.findOne({ _id: decoded.id });

  // if user not exist, throw the error
  if (!isUserExist) {
    return next(new ErrorHandler("User not exist ", 400));
  }

  //if user exist and isVerified field is true, throw the error ask user to login
  if (isUserExist.isVerified) {
    return next(new ErrorHandler("Your email is verified, Please login ", 400));
  }

  // if user  exist and  isVerified field is false, update the user as verified
  const user = await User.findOneAndUpdate(
    { _id: decoded.id },
    { isVerified: true }
  );

  // Then send success message to client
  res.status(201).json({
    success: true,
  });
});

// @desc    Login user
// @route   POST /api/v1/user/login
// @access  Public
export const loginUser = asyncErrorHandler(async (req, res, next) => {
  //Get email and password from user
  const { email, password } = req.body;

  //check email and password empty or not
  if (!email || !password) {
    return next(new ErrorHandler("Please provide an email and password", 400));
  }

  // find  user in DB
  const user = await User.findOne({ email }).select("+password");

  // if user not exist in DB throw error
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  //if user exist  in DB, Check if the user  verified their email
  if (!user.isVerified) {
    //If user not verified their email address,  Send activation link to the user

    const activationToken = createActivationToken(user._id);
    const activationCode = activationToken.ActivationCode;
    const message = activationCode;
    const ejsUrl = `welcome.ejs`;
    const name = user.name;

    //send activation code to user email
    try {
      await sendEmail({
        email: user.email,
        subject: "Activate your account",
        message,
        name,
        ejsUrl,
      });

      return res.status(201).json({
        success: true,
        message: `Please check your email ${user.email} to activate your account!`,
        activationToken: activationToken.token,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }

  //Check user password matches
  const isMatch = await user.comparePassword(password);

  // if not match, throw error
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  //import methods to generate access Token and refresh token
  sendTokensAsCookies(user._id, 200, res);
});

// @desc    Resend Activation code
// @route   POST /api/v1/user/resend_activation_code
// @access  Public
export const resendActivationCode = asyncErrorHandler(
  async (req, res, next) => {
    //Get user email from client by req.body
    const { email } = req.body;

    //find user in db by its email
    const user = await User.findOne({ email });

    // if user not exist, throw the error
    if (!user) {
      return next(new ErrorHandler("User not exist ", 400));
    }

    //if user exist and isVerified field is true, throw the error ask user to login
    if (user.isVerified) {
      return next(
        new ErrorHandler("Your email is verified, Please login ", 400)
      );
    }

    // if user   exist and  isVerified field is false, Send activation code to the user
    const activationToken = createActivationToken(user._id);

    const activationCode = activationToken.ActivationCode;

    const name = user.name;

    const message = activationCode;
    const ejsUrl = `welcome.ejs`;

    try {
      //send activation code to user email
      await sendEmail({
        email: user.email,
        subject: "Activate your account",
        message,
        name,
        ejsUrl,
      });

      //finally send success message to client
      res.status(200).json({
        success: false,
        message: `Please check your email ${user.email} to activate your account!`,
        activationToken: activationToken.token,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Update Access Token
// @route   GET /api/v1/user/refresh_Token
// @access  Public
export const updateAccessToken = asyncErrorHandler(async (req, res, next) => {
  //Get refresh token from cookies, every time client send request. the cookie send along with the request.
  const refresh_token = req.cookies.refreshToken;

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
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ErrorHandler("User not found. Please login again.", 404));
  }

  //Put user object on req.user for access by middleware
  req.user = user;

  //import methods to generate access Token and refresh token
  sendTokensAsCookies(user._id, 200, res);
});

// @desc    Logout user
// @route   GET /api/v1/user/logout
// @access  Public
export const logoutUser = asyncErrorHandler(async (req, res, next) => {
  res
    .cookie("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(0), // Set expiry to past date
    })
    .cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(0), // Set expiry to past date
    });

  //Send success message to client
  res.status(200).json({
    success: true,
    accessToken: "",
    message: "Logged out successfully",
  });
});

// @desc    Forgot Password
// @route   POST /api/v1/user/forgot_password
// @access  Public
export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //Get user email from client by req.body
  const { email } = req.body;

  // Check if email exists
  const user = await User.findOne({ email });

  //If user not exist, throw the error
  if (!user) {
    return next(new ErrorHandler("User not found with this email.", 404));
  }

  //If user exist, Generate a reset token and hash and set the reset token in the database
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set the reset token in the database
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/reset_password/${resetToken}`;

  //After create reset token, then send reset link to user email
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: resetUrl,
      name: user.name,
      ejsUrl: `forgotPassword.ejs`,
    });

    res.status(201).json({
      success: true,
      message: `Password reset email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler("Failed to send email. Try again later.", 500)
    );
  }
});

// @desc    Reset Password
// @route   POST /api/v1/user/reset_password/resetToken
// @access  Public
export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  //Get password, confirmPassword from req.body and resetToken from req.params
  const { resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  console.log(resetToken);

  // Hash the token to find the user
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find user by the hashed token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Ensure token is not expired
  });

  // Check if user exists, if not throw error
  if (!user) {
    return next(
      new ErrorHandler("Invalid or expired password reset token.", 400)
    );
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match.", 400));
  }

  //If everything is ok, Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  //After reset password, send success message to client
  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
});

// @desc    Update user Password
// @route   PUT /api/v1/user/update_password
// @access  Private
export const updatePassword = asyncErrorHandler(async (req, res, next) => {
  //Get currentPassword, newPassword, and confirmPassword from the client by req.body
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Check if all fields are provided
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Find the user in the database by ID, we get user ID from req.user from isAuthenticated middleware
  const user = await User.findById(req.user._id).select("+password");

  //Check if user exist, if not throw error to client
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //If user exist, Check if current password matches with password in DB
  const isMatch = await user.comparePassword(currentPassword);

  //If current password is not match, throw error to client
  if (!isMatch) {
    return next(new ErrorHandler("Current password is incorrect", 401));
  }

  //If current password matches, Check if new password and confirm password match also
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New password and confirm password do not match", 400)
    );
  }

  //If everything is ok, Update the user's password
  user.password = newPassword;
  await user.save();
  //Finally send success message to client
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// @desc    Update User Avatar
// @route   POST /api/v1/user/update_avatar
// @access  Private
export const updateAvatar = asyncErrorHandler(async (req, res, next) => {
  //Get user avatar from client by req.file. The new avatar image data (Base64 or image URL)
  const avatar = req.file?.path;

  //If avatar not exist, throw error to client
  if (!avatar) {
    return next(new ErrorHandler("Avatar image is required", 400));
  }

  //If avatar found, then find user by ID, we get ID from req.user isAuthenticated middleware
  const user = await User.findById(req.user._id);
  //If user not found, throw error to client
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //If user exist and avatar found, Delete the existing avatar from Cloudinary
  if (user.avatar.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  //Then Upload the new avatar to Cloudinary
  const result = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  // Update also user's avatar in the database
  user.avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };
  await user.save();

  //Finally send success message to client
  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    avatar: user.avatar,
  });
});

// @desc    Get User Profile
// @route   GET /api/v1/user/me
// @access  Private
export const getUserInfo = asyncErrorHandler(async (req, res, next) => {
  // Find the authenticated user by ID
  const user = await User.findById(req.user._id).select("-password");

  //If user not found, throw error to client
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //If user exist, send user data to client
  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/user/update_me
// @access  Private
export const updateUserInfo = asyncErrorHandler(async (req, res, next) => {
  //Get name, email, phoneNumber from req.body
  const { name, email, phoneNumber } = req.body;

  // Validate input
  if (!name || !email) {
    return next(new ErrorHandler("Name and email are required!", 400));
  }

  // Validate email format
  const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegexPattern.test(email)) {
    return next(new ErrorHandler("Invalid email format", 400));
  }

  // Validate phone number format if provided
  if (phoneNumber) {
    const phoneNumberRegexPattern =
      /^[+]?[0-9]{0,3}\W??[0-9]{3}?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4,6}$/im;
    if (!phoneNumberRegexPattern.test(phoneNumber)) {
      return next(new ErrorHandler("Invalid phone number format", 400));
    }
  }

  // Update user information and return the updated user and enable Validation
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email, phoneNumber },
    { new: true, runValidators: true }
  );

  //If user not found, throw error to client
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //Finally send success message to client
  res.status(200).json({
    success: true,
    message: "User information updated successfully!",
    user,
  });
});

// @desc    Add User Address
// @route   POST /api/v1/user/add_address
// @access  Private

export const addUserAddress = asyncErrorHandler(async (req, res, next) => {
  //Get country, city, address1, address2, zipCode, addressType, state from req.body
  const { country, city, address1, address2, zipCode, addressType, state } =
    req.body;

  // Validate required fields,  if not valid throw error
  if (!country || !city || !address1) {
    return next(
      new ErrorHandler("Country, city, and address1 are required fields", 400)
    );
  }

  //Find user from DB by using ID, we get ID from req.user
  const user = await User.findById(req.user._id);

  //If user not exist then throw error
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if user enter the addressType is default
  if (addressType === "default") {
    //if default addressType, Set all existing addresses' addressType to "other"
    user.addresses = user.addresses.map((address) => ({
      ...address.toObject(),
      addressType: "other",
    }));
  }

  // Add the new address to the user's address array
  const newAddress = {
    country,
    city,
    address1,
    address2,
    zipCode,
    state,
    addressType: addressType || "other", // Default to "other" if not provided
  };
  user.addresses.push(newAddress);

  // Save the user with the updated addresses
  await user.save();

  //Finally send success message to client
  res.status(201).json({
    success: true,
    message: "Address added successfully",
    addresses: user.addresses,
  });
});

// @desc    Update User Address
// @route   PUT /api/v1/user/update_address/:addressID
// @access  Private
export const updateUserAddress = asyncErrorHandler(async (req, res, next) => {
  //Get address ID from req.params
  const { addressID } = req.params;

  //Get country, city, address1, address2, zipCode, state, addressType from req.body
  const { country, city, address1, address2, zipCode, state, addressType } =
    req.body;

  // Find user by ID, we get ID from req.user isAuthenticated middleware
  const user = await User.findById(req.user._id);

  //If user not exist ,throw error to client
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Find the address by ID(req.params. AddressID)in user's addresses array
  const address = user.addresses.id(addressID);

  //If address not exist, throw error to client
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  // Update the address fields,  if exit to update
  if (country) address.country = country;
  if (city) address.city = city;
  if (address1) address.address1 = address1;
  if (address2) address.address2 = address2;
  if (zipCode) address.zipCode = zipCode;

  // Handle addressType to ensure only one default
  if (addressType === "default") {
    user.addresses.forEach((addr) => {
      addr.addressType = "other"; // Set all other addresses to "other"
    });
    address.addressType = "default";
  } else if (addressType) {
    address.addressType = addressType;
  }

  // Save the updated user document
  await user.save();

  //Finally send success message to client
  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    addresses: user.addresses,
  });
});

// @desc    Delete User Address
// @route   DELETE /api/v1/user/delete_address/:addressID
// @access  Private
export const deleteUserAddress = asyncErrorHandler(async (req, res, next) => {
  //Get addressID from req.params
  const { addressID } = req.params;

  // Find user by ID,  we get ID from req.user isAuthenticated middleware
  const user = await User.findById(req.user._id);
  //If user not exist, throw error to client
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Find and remove the address from the addresses array
  const addressIndex = user.addresses.findIndex(
    (address) => address._id.toString() === addressID
  );

  //If address not found, throw error to client
  if (addressIndex === -1) {
    return next(new ErrorHandler("Address not found", 404));
  }

  //If address exist, Remove the address
  user.addresses.splice(addressIndex, 1);

  //If everything goes well, Save the updated user document
  await user.save();

  //Finally send success message to client
  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
    addresses: user.addresses,
  });
});

// @desc Social Auth
// @route POST /api/v1/user/social_auth
// @access Public
export const socialAuth = asyncErrorHandler(async (req, res, next) => {
  //Get user info from client which we get it from social auth provider
  const { email, name, photo, provider } = req.body;

  //Find if user exist by its email
  const user = await User.findOne({ email });

  //If user not exist, generate password and save user in db
  if (!user) {
    const generatePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const newUser = await User.create({
      email,
      name,
      password: generatePassword,
      avatar: photo,
      isVerified: true,
      provider,
    });

    // After saving user in db, generate access and refresh token and send it to client
    sendTokensAsCookies(newUser._id, 200, res);
  } else {
    //If user exist in db, check if user register with local login with that email, if it is throw error
    if (user.provider === "local") {
      return next(
        new ErrorHandler(
          "you have account with us, please login with your email and password",
          400
        )
      );
    } else {
      //if user exist in db and register with social auth, login the user by generate access and refresh token and send it to client
      sendTokensAsCookies(user._id, 200, res);
    }
  }
});

// @desc    Delete User
// @route   DELETE /api/v1/user/delete_user
// @access  Private
export const deleteUserAccount = asyncErrorHandler(async (req, res, next) => {
  // Find user by ID, we get ID from req.user isAuthenticated middleware
  const user = await User.findById(req.user.id);

  //If user not found, throw error to client
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Remove user's avatar from Cloudinary if it exists
  if (user.avatar && user.avatar.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  // Delete the user from the database
  await user.deleteOne();

  //Finally send success message to client
  res.status(200).json({
    success: true,
    message: "Your account has been successfully deleted.",
  });
});

//Admin Controllers

// @desc    Get User By ID for Admin
// @route   GET /api/v1/user/admin/get_user_info/:user_id
// @access  Private
export const getUserByIdForAdmin = asyncErrorHandler(async (req, res, next) => {
  //Get user ID from req.params
  const { user_id } = req.params;

  // Find user by ID
  const user = await User.findById(user_id);

  //If user not found, throw error to Admin
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //Finally send success message to Admin
  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Get all users by admin
// @route   GET /api/v1/user/admin /all_users
// @access  Private
export const getAllUsersForAdmin = asyncErrorHandler(async (req, res, next) => {
  // Retrieve all users with role "user", exclude "admin" role
  const users = await User.find({ role: "user" });

  //If no user found, throw error to Admin
  if (!users || users.length === 0) {
    return next(new ErrorHandler("No users found", 404));
  }

  //Finally send success message to Admin
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Delete User By ID for Admin
// @route   DELETE /api/v1/user/admin/delete_user_info/:user_id
// @access  Private
export const deleteUserByIdForAdmin = asyncErrorHandler(
  async (req, res, next) => {
    //Get ID from req.params
    const { user_id } = req.params;

    // Find user by ID
    const user = await User.findById(user_id);

    //If user not found, throw error to Admin
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Delete user
    await user.deleteOne();

    //Finally send success message to Admin
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);

// @desc    Update user by admin
// @route   PUT /api/v1/user/update_user/:id
// @access  Private
