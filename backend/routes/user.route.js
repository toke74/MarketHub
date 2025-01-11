import express from "express";
import {
  registerUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Create user route
userRouter.post("/register", registerUser);


export default userRouter;