const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const repliesSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  tag: {
    type: Array,
    default: [],
  },
  date: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Reply", repliesSchema);
