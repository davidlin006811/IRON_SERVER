const express = require("express");
const router = express.Router();
const Career = require("../models/career");
const Candidate = require("../models/candidate");
const isLoggedIn = require("../functions/isLoggedin");
const mongoose = require("mongoose");

//For client side:

//1) Get all careers - /api/career/all, for the response, please refer to the client-side coding tasks.
router.get("/all", (req, res) => {
  Career.find()
    .sort({ date: -1 })
    .then(messages => {
      res.status(200).json(messages);
    });
});

//2) Apply a career - /api/career/apply (method: Post), this action will add a candidate object to the candidates list of the appropriate career. for the response, please refer to the client-side coding tasks.
router.post("/apply", (req, res) => {
  const candidate = new Candidate({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    resume: req.body.resume,
    careerId: req.body.careerId
  });
  candidate
    .save()
    .try(result => {
      const newCandidate = {
        createdCandidate: {
          name: result.name,
          email: result.email,
          resume: result.resume,
          careerId: result.careerId
        }
      };
      io.sockets.emit("new candidate", newCandidate);
      res.status(201).json({
        message: "created candidate successfully",
        newCandidate
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


//For Back-end management side:

//3) List all careers - /api/career/list (method: Get, authorization: isLoggedIn), this action will send the all careers including the candidates information to the owner side.
router.get("/list", isLoggedIn, (req, res) => {

});

//4) Update a career - /api/career/update (method: Post, authorization:  isLoggedIn), this action allows the owner update and save a career
router.patch("update/:id", isLoggedIn, (req, res) => {
  Career.update({ _id: req.params.id }, req.body)
    .then(result => res.status(200).json({
      message: "updated career successfully",
      result
    }))
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});

//5) Delete a career - /api/career/:careerId (method: Delete, authorization:  isLoggedIn), this action allows the owner delete a career
router.delete("/:id", isLoggedIn, (req, res) => {
  let filePaths = [];
  Career.findByIdAndDelete(req.params.id)
    .then(result => {
      //get image file paths
      filePaths = result.images;
      //remove the related image files
      filePaths.forEach(filePath => {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.log(err);
        }
      });
      res.status(200).json({ code: 0, message: result.name + " was removed" });
    })
    .catch(err =>
      res.status(500).json({
        error: err
      })
    );
});

//6) Post a career - /api/career (method: Post, authorization:  isLoggedIn), this action allows the owner post a career
router.post("/", isLoggedIn, (req, res) => { 
  const filePaths = req.files.map(file =>
    file.path.replace(new RegExp("\\\\", "g"), "/")
  );
  const career = new Career({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    images: filePaths
  });
  career
  .save()
  .then(result => {
    const newCareer = {
      createdCareer: {
        title: result.title,
        description: result.description,
        images: result.images
      }
    };
    io.sockets.emit("new career", newCareer);
    res.status(201).json({
      message: "created career successfully",
      newCareer
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

// export router
module.exports = router;
