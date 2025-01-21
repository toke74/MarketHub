//import modules
import jwt from "jsonwebtoken";
import crypto from "crypto";

//import local files
import User from "../model/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncErrorHandler from "../middlewares/catchAsyncErrors.js";
import { createActivationToken } from "../utils/generateTokens.js";
import sendEmail from "../utils/sendEmail.js";
import sendTokensAsCookies from "../utils/sendTokensAsCookies.js";

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

// @desc    Get user profile
// @route   GET /api/v1/user/me
// @access  Private

// @desc    Update user profile
// @route   PUT /api/v1/user/update_me
// @access  Private

// @desc    Update user avatar
// @route   PUT /api/v1/user/update_avatar
// @access  Private

// @desc    update user address
// @route   PUT /api/v1/user/update_address
// @access  Private

// @desc    delete user
// @route   DELETE /api/v1/user/delete_user/:id
// @access  Private

// @desc Social Auth
// @route POST /api/v1/user/social_auth
// @access Public

//Admin Controllers
// @desc    Get all users by admin
// @route   GET /api/v1/user/all_users
// @access  Private

// @desc    Get user details by admin
// @route   GET /api/v1/user/user_details/:id
// @access  Private

// @desc    Update user by admin
// @route   PUT /api/v1/user/update_user/:id
// @access  Private

// @desc    Delete user by admin
// @route   DELETE /api/v1/user/delete_user/:id
// @access  Private
