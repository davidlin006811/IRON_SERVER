const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const uuid = require("../functions/uuid");
const ADMIN = require("../config/admin").role;
const SMSNumber = require("../config/admin").SMSNumber;
const MailNode = require("../functions/mail");

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
    //console.log(result);
    const result = {
      createdReview: {
        name: data.name,
        rating: data.rating,
        comment: data.comment
      }
    };
    //if onwer is online and logged in, send the message via socket.io
    if (ADMIN in global[uuid]) {
      global[uuid][ADMIN].emit("new message", result, function() {
        res
          .status(200)
          .json({ code: 0, message: "ubmit a review successfully", result });
      });
    } else {
      const subject = "A Message From Client";
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
        res
          .status(200)
          .json({ code: 0, message: "A SMS was sent to the owner" });
      });
    }
  });
});

// export router
module.exports = router;
