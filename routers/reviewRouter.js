const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const uuid = require("../functions/uuid");
const SMSNumber = require("../config/admin").SMSNumber;
const MailNode = require("../functions/mail");
const isEmpty = require("../functions/isEmpty");
//1) Get all reviews API - /api/review/all, for the response, please refer to the client-side coding tasks.
router.get("/all", (req, res) => {
  Review.find()
    .sort({ date: -1 })
    .then(messages => {
      res.status(200).json(messages);
    });
});

//2) Post a review - /api/review, for the response, please refer to the client-side coding tasks.

router.post("/", (req, res) => {
  const review = new Review({
    name: req.body.name,
    rating: req.body.rating,
    comment: req.body.comment
  });

  review.save().then(data => {
    //if onwer is online and logged in, send the message via socket.io

    io.sockets.emit("new review", data);
    res
      .status(200)
      .json({ code: 0, message: "A review was sent to the owner" });

    const subject = "A Review From Client";
    const content =
      "Client Name: " +
      data.name +
      "\n" +
      "Client Rating: " +
      "\n" +
      data.rating +
      "\n" +
      "Client Comment:" +
      data.comment;
    MailNode(SMSNumber, subject, content, function() {
      res.status(200).json({ code: 0, message: "A SMS was sent to the owner" });
    });
  });
});

router.delete("/:id", (req, res) => {
  Review.findOneAndRemove({ _id: req.params.id }).then(result => {
    io.sockets.emit("delete review", result);
    res
      .status(200)
      .json({ code: 0, message: "Review was deleted successfully" });
  });
});

// export router
module.exports = router;
