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
  updatePassword,
  updateAvatar,
  getUserInfo,
  updateUserInfo,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  socialAuth,
  deleteUserAccount,
  getUserByIdForAdmin,
  getAllUsersForAdmin,
  deleteUserByIdForAdmin,
} from "../controllers/user.controller.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { uploadAvatarImage } from "../middlewares/fileUploadMiddleware.js";

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
userRouter.post("/reset_password", resetPassword);

// update Password route
userRouter.put("/update_password", isAuthenticated, updatePassword);

// update Avatar route
userRouter.post(
  "/update_avatar",
  isAuthenticated,
  uploadAvatarImage,
  updateAvatar
);

// Get user profile route
userRouter.get("/me", isAuthenticated, getUserInfo);

// Update user profile route
userRouter.put("/update_me", isAuthenticated, updateUserInfo);

// Add user address route
userRouter.post("/add_address", isAuthenticated, addUserAddress);

// Update user address route
userRouter.put(
  "/update_address/:addressID",
  isAuthenticated,
  updateUserAddress
);

// Delete user address route
userRouter.delete(
  "/delete_address/:addressID",
  isAuthenticated,
  deleteUserAddress
);

// Social auth route
userRouter.post("/social_auth", socialAuth);

// Delete user Account route
userRouter.delete("/delete_user", isAuthenticated, deleteUserAccount);

// Admin  Use Only route
// Get  user info by admin route
userRouter.get(
  "/admin/get_user_info/:user_id",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserByIdForAdmin
);

// Get  all user info by admin route
userRouter.get(
  "/admin/all_users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsersForAdmin
);

// Delete  user  by admin route
userRouter.delete(
  "/admin/delete_user_info/:user_id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUserByIdForAdmin
);

export default userRouter;
