const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const isLoggedIn = require("../functions/isLoggedin");
const SMSNumber = require("../config/admin").SMSNumber;
const MailNode = require("../functions/mail");
const sanitizeHtml = require("sanitize-html"); // HTML sanitizer
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
  const name = sanitizeHtml(req.body.name, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const rating = sanitizeHtml(req.body.rating, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const comment = sanitizeHtml(req.body.comment, {
    allowedTags: [],
    allowedAttributes: {}
  });
  const review = new Review({
    name: name,
    rating: rating,
    comment: comment
  });

  review.save().then(data => {
    //if onwer is online and logged in, send the message via socket.io
    let rating;
    let numRating = parseInt(data.rating);

    switch (numRating) {
      case 0:
      case 1:
        rating = "Very Poor";
        break;
      case 2:
        rating = "Poor";
        break;
      case 3:
        rating = "Fair";
        break;
      case 4:
        rating = "Good";
        break;
      default:
        rating = "Great";
    }
    console.log("rating: ", rating);
    io.sockets.emit("new review", data);
    res
      .status(200)
      .json({ code: 0, message: "A review was sent to the owner" });

    const subject = "A Review From Client";
    const content =
      "Name: " +
      data.name +
      "\n" +
      "Rating: " +
      rating +
      "\n" +
      "Comment:" +
      data.comment;
    MailNode(SMSNumber, subject, content, function() {
      res.status(200).json({ code: 0, message: "A SMS was sent to the owner" });
    });
  });
});

router.delete("/:id", isLoggedIn, (req, res) => {
  Review.findOneAndRemove({ _id: req.params.id }).then(result => {
    io.sockets.emit("delete review", result);
    res
      .status(200)
      .json({ code: 0, message: "Review was deleted successfully" });
  });
});

// export router
module.exports = router;
