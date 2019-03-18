const mongoose = require("mongoose");
const router = require("express").Router();
const Message = require("../models/message");
const uuid = require("../functions/uuid");
const ADMIN = require("../config/admin").role;
const SMSNumber = require("../config/admin").SMSNumber;
const MailNode = require("../functions/mail");
router.get("/all", (req, res) => {
  Message.find()
    .sort({ date: -1 })
    .then(messages => {
      res.status(200).json(messages);
    });
});

router.post("/", (req, res) => {
  //console.log(req);
  const message = new Message({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    content: req.body.content
  });
  //save new message to database
  message.save().then(data => {
    const result = {
      name: data.name,
      email: data.email,
      content: data.content,
      date: data.date
    };
    //if onwer is online and logged in, send the message via socket.io
    if (ADMIN in global[uuid]) {
      global[uuid][ADMIN].emit("new message", result, function() {
        res
          .status(200)
          .json({ code: 0, message: "Message was sent to the owner" });
      });
    } else {
      const subject = "A Message From Client";
      const content =
        "Client Name: " +
        result.name +
        "\n" +
        "Client Email: " +
        "\n" +
        result.email +
        "\n" +
        " Mesage:" +
        result.content;
      MailNode(SMSNumber, subject, content, function() {
        res
          .status(200)
          .json({ code: 0, message: "A SMS was sent to the owner" });
      });
    }
  });
});
module.exports = router;
