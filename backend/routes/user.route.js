import express from "express";
import {
  registerUser,
  activateUser,
  loginUser,
  resendActivationCode
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

export default userRouter;
