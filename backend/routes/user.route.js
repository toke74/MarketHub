import express from "express";
import {
  registerUser,
  activateUser
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Create user route
userRouter.post("/register", registerUser);

// activate user route
userRouter.post("/activate_user", activateUser);


export default userRouter;