//import packages
import jwt from "jsonwebtoken";

//import local file
import ErrorHandler from "../utils/errorHandler.js";
import asyncErrorHandler from "../middlewares/catchAsyncErrors.js";
import User from "../model/user.model.js";

import "dotenv/config";

// @desc   Authenticate User middleware
// @access  Private
export const isAuthenticated = asyncErrorHandler(async (req, res, next) => {
  //Get access token from req.cookies
  const access_token = req.cookies.accessToken;

  //If access token empty, throw error to client
  if (!access_token) {
    return next(new ErrorHandler("Unauthorized user, Please login. ", 401));
  }

  //If access token not empty, verify validity of the token
  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

  //If not valid token, throw error to client
  if (!decoded) {
    return next(
      new ErrorHandler("Access token is not valid, Please login ", 401)
    );
  }

  //If it is valid token, find user from db by using decoded ID from jwt.verify()
  const user = await User.findById(decoded.id);

  //If user not found in db, throw error to client
  if (!user) {
    return next(new ErrorHandler("Unauthorized user, Please login.", 400));
  }

  //If user exist in db,  assign to req.user
  req.user = user;

  //If everything is ok then pass to next function
  next();
});
