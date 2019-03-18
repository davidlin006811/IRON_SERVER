const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  name: String,
  email: String,
  resume: [String]
});
module.exports = mongoose.model("Candidate", CandidateSchema);
