const mongoose = require("mongoose");
const router = require("express").Router();
const Message = require("../models/message");
const uuid = require("../functions/uuid");
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
    //if onwer is online and logged in, send the message via socket.io
    // console.log(io);
    io.to("admins").emit("new message", data);
    res.status(200).json({ code: 0, message: "Message was sent to the owner" });

    const subject = "A Message From Client";
    const content =
      "Client Name: " +
      data.name +
      "\n" +
      "Client Email: " +
      "\n" +
      data.email +
      "\n" +
      " Mesage:" +
      data.content;
    MailNode(SMSNumber, subject, content, function() {
      res.status(200).json({ code: 0, message: "A SMS was sent to the owner" });
    });
  });
});
router.delete("/:id", (req, res) => {
  Message.findOneAndDelete({ _id: req.params.id }).then(result => {
    io.to("admins").emit("delete message", result);
    res.json({ code: 0, message: "Message was deleted successfully" });
  });
});
module.exports = router;
