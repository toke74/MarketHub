//module imports
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//local imports
import "dotenv/config.js";
import ErrorHandlerMiddleware from "./middlewares/error.js";
import userRouter from "./routes/user.route.js";
import vendorRouter from "./routes/vendor.route.js";
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";

export const app = express();
const { ORIGIN } = process.env;

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: ORIGIN,
    credentials: true,
  })
);

//passing bodyParser middleware
app.use(express.json({ limit: "50mb" }));

//cookie parser middleware
app.use(cookieParser());

// //cors middleware
// app.use(
//   cors({
//     origin: ORIGIN,
//   })
// );

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/vendor", vendorRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

//testing route
app.get("/test", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Test API is Working",
  });
});

//all Unknown Routes
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// it's for ErrorHandling
app.use(ErrorHandlerMiddleware);
