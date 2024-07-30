const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lakeSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  latitude: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  longitude: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  shore_fishing: {
    type: Boolean,
    default: false,
  },
  impressions: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Lake", lakeSchema);
