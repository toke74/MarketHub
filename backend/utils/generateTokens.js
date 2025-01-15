import jwt from "jsonwebtoken";
import "dotenv/config.js";

// Accessing environment variables
const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION || '15m'; // Fallback to 15 minutes
const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || '30d'; // Fallback to 30 days


//create Activation Token
export const createActivationToken = (id) => {
  //Generate random 4 digit number
  const ActivationCode = Math.floor(1000 + Math.random() * 9000).toString();

//Sign the Activation Code with jwt
  const token = jwt.sign(
    {
      id,
      ActivationCode,
    },
    process.env.ACTIVATION_SECRET,
    {
  expiresIn: process.env.JWT_ACTIVATION_EXPIRES,
    }
  );

  return { token, ActivationCode };
};



// Generating Access Token
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: `${accessTokenExpiration}m`,
  });
};

// Generating Refresh Token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: refreshTokenExpiration,
  });
};
