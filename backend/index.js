import { app } from "./app.js";
import "dotenv/config.js";
import connectDB from "./db/database.js";

const port = process.env.PORT || 8000;



//create server
app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
  connectDB(); // DB connection
});