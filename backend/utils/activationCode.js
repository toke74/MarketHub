import jwt from "jsonwebtoken";
import "dotenv/config.js";

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