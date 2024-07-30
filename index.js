const express = require("express");
require("dotenv").config();

//Setting up middleware
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./databaseConfig");
app.use(express.json())

//Connecting to mongo
connectDB()


app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

mongoose.connection.once("open", () => {
  console.log("Connected to mongodb");
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
})
