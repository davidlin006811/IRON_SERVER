const express = require("express");
const router = express.Router();
const Appoinment = require("../models/appointment");

//Post an appointment - /api/appointment (method: Post),  for the response, please refer to the client-side coding tasks.
router.get("/all", (req, res) => {
  Appoinment.find()
    .sort({ date: -1 })
    .then(messages => {
      res.status(200).json(messages);
    });
});

// export router
module.exports = router;