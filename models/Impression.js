const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const impressionSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Impression", impressionSchema);
