const express = require("express");
const router = express.Router();
const SMSNumber = require("../config/admin").SMSNumber;
const MailNode = require("../functions/mail");
const sanitizeHtml = require("sanitize-html"); // HTML sanitizer

router.post("/", (req, res) => {
  const data = req.body;
  const name = sanitizeHtml(req.body.name, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const email = sanitizeHtml(req.body.email, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const date = sanitizeHtml(req.body.date, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const event = sanitizeHtml(req.body.content, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const subject = "An appointment From Client";
  const content =
    "Name: " +
    name +
    "\n" +
    "Email: " +
    email +
    "\n" +
    "Appointment Date: " +
    date +
    "\n" +
    "Event: " +
    event;
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
