const express = require("express");
const router = express.Router();
const SMSNumber = require("../config/admin").SMSNumber;
const MailNode = require("../functions/mail");
//const Appoinment = require("../models/appointment");

//Post an appointment - /api/appointment (method: Post),  for the response, please refer to the client-side coding tasks.
/*router.get("/all", (req, res) => {
  Appoinment.find()
    .sort({ date: -1 })
    .then(messages => {
      res.status(200).json(messages);
    });
});*/
router.post("/", (req, res) => {
  const data = req.body;
  const subject = "An appointment From Client";
  const content =
    "Client Name: " +
    data.name +
    "\n" +
    "Client Email: " +
    "\n" +
    data.email +
    "\n" +
    "Appointment Date: " +
    data.date +
    "\n" +
    "Event: " +
    data.content;
  MailNode(SMSNumber, subject, content, function() {
    res.status(200).json({
      code: 0,
      message: "An appointment was sent to the owner",
      appointemnt: req.body
    });
  });
});
// export router
module.exports = router;
