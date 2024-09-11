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
const Impression = require("./models/Impression");
const Lake = require("./models/Lake");

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

app.post("/lakes", async (req, res) => {
  let apiKey = req.headers["x-api-key"] || req.headers["X-API-Key"];
  const validation = await validateApiKey(apiKey);
  if (validation) {
    try {
      const data = req.body;
      let payload = {};
      if (data.name != undefined) {
        Object.assign(payload, { name: data.name });
      }
      if (data.latitude != undefined) {
        Object.assign(payload, { latitude: data.latitude });
      }
      if (data.longitude != undefined) {
        Object.assign(payload, { longitude: data.longitude });
      }
      if (data.shore_fishing != undefined) {
        Object.assign(payload, { shore_fishing: data.shore_fishing });
      }
      const newLake = new Lake(payload);
      const mongoRes = await newLake.save();
      if (mongoRes != null) {
        res.json({
          code: 200,
          status: "Success",
          body: mongoRes,
        });
      }
    } catch (err) {
      res.json({
        code: 402,
        status: "Error",
        message: err.message,
      });
    }
  } else {
    res.json({
      code: 401,
      status: "Error",
      message: "Unauthorized",
    });
  }
});

app.get("/lakes", async (req, res) => {
  let apiKey = req.headers["x-api-key"] || req.headers["X-API-Key"];
  const validation = await validateApiKey(apiKey);
  if (validation) {
    try {
      const query = req.query;
      const latitude = parseFloat(query.latitude);
      const longitude = parseFloat(query.longitude);
      const mongoRes = await Lake.findOne({
        latitude: latitude,
        longitude: longitude,
      });
      console.log(mongoRes);
      if(mongoRes != null){
        res.json({
          code: 200,
          status: "Success",
          body: mongoRes.toJSON(),
        });
      }
      else {
        res.json({
          code: 401,
          status: "Error",
          body: "Lake not found"
        })
      }
    } catch (err) {
      res.json({
        code: 402,
        status: "Error",
        message: err.message,
      });
    }
  } else {
    res.json({
      code: 401,
      status: "Error",
      message: "Unauthorized",
    });
  }
});

app.patch("/lakes/:id", async (req, res) => {
  let apiKey = req.headers["x-api-key"] || req.headers["X-API-Key"];
  const validation = await validateApiKey(apiKey);
  if (validation) {
    try {
      const lakeId = req.params.id
      const data = req.body;
      let payload = {};
      if (data.name != undefined) {
        Object.assign(payload, { name: data.name });
      }
      if (data.latitude != undefined) {
        Object.assign(payload, { latitude: data.latitude });
      }
      if (data.longitude != undefined) {
        Object.assign(payload, { longitude: data.longitude });
      }
      if (data.shore_fishing != undefined) {
        Object.assign(payload, { shore_fishing: data.shore_fishing });
      }
      const lakeUpdate = await Lake.findOneAndUpdate({_id: lakeId}, payload)
      if(lakeUpdate != null){
        res.json({
          code: 200,
          status: "Success"
        })
      }
      else {
        res.json({
          code: 401,
          status: "Error",
          body: "Lake not found"
        })
      }
    } catch(err) {
      res.json({
        code: 402,
        status: "Error",
        message: err.message,
      });
    }
  } else {
    res.json({
      code: 400,
      status: "Error",
      body: "Api Key is not valid"
    })
  }
})

mongoose.connection.once("open", () => {
  console.log("Connected to mongodb");
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
});
