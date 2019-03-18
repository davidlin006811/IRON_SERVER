const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  name: String,
  email: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Message", MessageSchema);
