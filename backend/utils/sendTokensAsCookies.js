import "dotenv/config.js";
import {generateAccessToken, generateRefreshToken} from './generateTokens.js';
import asyncErrorHandler  from "../middlewares/catchAsyncErrors.js";


// Function to send tokens via cookies
  const sendTokensAsCookies = asyncErrorHandler(async (userId, statusCode, res) => {
  const  accessToken = generateAccessToken(userId);
  const  refreshToken  = generateRefreshToken(userId);

  // Options for Access Token Cookie
  const accessTokenCookieOptions = {
    httpOnly: true, // Accessible only by the web server
    secure: process.env.NODE_ENV === 'production', // Send over HTTPS only in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  };

  // Options for Refresh Token Cookie
  const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  };

  // Set cookies
  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  // Optionally, send tokens in the response body as well
  res.status(statusCode).json({
   success: true,
   accessToken,
 });
  
});


export default sendTokensAsCookies;