import express from "express";
import {
  registerUser,
  activateUser,
  loginUser,
  resendActivationCode,
  updateAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Create user route
userRouter.post("/register", registerUser);

// activate user route
userRouter.post("/activate_user", activateUser);

// Login user route
userRouter.post("/login", loginUser);

// Resend activation code route
userRouter.post("/resend_activation_code", resendActivationCode);

// Update Access Token route
userRouter.get("/refresh_Token", updateAccessToken);

// logout route
userRouter.get("/logout", logoutUser);

// Forgot Password route
userRouter.post("/forgot_password", forgotPassword);

// Reset Password route
userRouter.post("/reset_password/resetToken", resetPassword);

export default userRouter;
