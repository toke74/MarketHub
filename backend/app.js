//module imports
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//local imports
import "dotenv/config.js";
import ErrorHandlerMiddleware from "./middlewares/error.js";

export const app = express()
const { ORIGIN } = process.env;

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ORIGIN,
    credentials: true
  })
);

//passing bodyParser middleware
app.use(express.json({ limit: "50mb" }));

//cookie parser middleware
app.use(cookieParser());

//cors middleware
app.use(
  cors({
    origin: ORIGIN,
  })
);

//routes middleware go's here


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