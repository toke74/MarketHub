import mongoose from "mongoose";
import "dotenv/config.js";

const  MONGODB_URI  = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI).then((data) => {
      console.log(`MongoDB Database Connected with ${data.connection.host}`);
    });
  } catch (error) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;