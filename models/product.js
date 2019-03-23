const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  description: String,
  images: [String],
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Product", ProductSchema);
