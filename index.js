const express = require("express");
require("dotenv").config();

//Setting up middleware
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./databaseConfig");
app.use(express.json());

//Connecting to mongo
connectDB();

const rateLimit = require("express-rate-limit");

const REQPERMS = 20;
const TimeOfRequest = 15 * 60 * 1000;
const createDeveloperLimiter = rateLimit({
  windowMs: TimeOfRequest,
  max: REQPERMS,
});

//MODELS
const Impression = require("./models/Impression")
const Lake = require("./models/Lake")

//Middleware
const validateDeveloperBody = require("./middleware/validateDeveloperBody");
const postDeveloper = require("./middleware/developer");
const validateApiKey = require("./middleware/validateApiKey");

//    ROUTES
app.get("/", (req, res) => {
  res.send("FishLakes server is live");
});

app.post(
  "/developer",
  createDeveloperLimiter,
  validateDeveloperBody,
  postDeveloper
);

mongoose.connection.once("open", () => {
  console.log("Connected to mongodb");
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
});
