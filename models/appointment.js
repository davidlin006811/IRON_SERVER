const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  name: String,
  email: String,
  appointment_date: Date
});
module.exports = mongoose.model("Appointment", AppointmentSchema);
