const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const impressionSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  media: {
    type: String,
    default: "",
  },
  author: {
    type: String,
    required: true,
  },
  replies: {
    type: Array,
    default: [],
  },
  lake: {
    type: Schema.Types.ObjectId,
    ref: "Lake",
  },
  date: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Impression", impressionSchema);
