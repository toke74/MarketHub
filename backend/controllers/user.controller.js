import User from "../model/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncErrorHandler  from "../middlewares/catchAsyncErrors.js";
import { createActivationToken } from "../utils/activationCode.js";
import sendEmail from "../utils/sendEmail.js";


// @desc    Register user
// @route   POST /api/v1/user/register
// @access  Public
export const registerUser = asyncErrorHandler( async (req, res, next) => {
  
//get user email, password and name from req.body
const { name, email,password }=req.body;

//check if the use exist in database
const isUserExist = await User.findOne({ email });

//if it exist throw error back to user
if (isUserExist) { return next( new ErrorHandler(`User already exists`, 400));
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
  }
);