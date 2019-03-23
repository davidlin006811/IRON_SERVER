const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CareerSchema = new Schema({
  title: String,
  description: String,
  images: [String]
});

module.exports = mongoose.model("Career", CareerSchema);
